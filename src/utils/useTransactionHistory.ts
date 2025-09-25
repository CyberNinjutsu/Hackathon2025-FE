import { useState, useEffect, useCallback } from "react";
import {
  AccountInfo,
  Connection,
  ParsedAccountData,
  ParsedInstruction,
  PartiallyDecodedInstruction,
  PublicKey,
  clusterApiUrl,
  LAMPORTS_PER_SOL,
  ComputeBudgetProgram,
  SignaturesForAddressOptions,
} from "@solana/web3.js";
import { TOKEN_2022_PROGRAM_ADDRESS } from "@solana-program/token-2022";
import {
  MintInfo,
  ParsedTransaction,
  TokenBalance,
  Transaction,
} from "./Types";

const swapPrograms = [
  "9xQeWvG816bUx9EPfDdG9w7d6dXKJbTgkGMwzV3bRjP7", // Serum DEX
  "RVKd61ztZW9CdCtzZ9Gx8JepQ2iwtrtUmkfmAxs2gF7", // Raydium
  "9WwFFoJDP9N6hGPBhv1L6J7wS2tZJgJGnDzvx2Vhzy4k", // Orca
  "JUP6LkbZbjS4tYqbNrtYmNHJvZs3Kox7c3M1TUPNQm8", // Jupiter
];

function isSetupTransactionByLogs(logs: string[] | undefined): boolean {
  if (!logs || logs.length === 0) {
    return false;
  }

  const setupKeywords = [
    "Program log: Create",
    "Initialize the associated token account",
    "Instruction: InitializeAccount",
    "Instruction: CreateAccount",
    "Program log: Instruction: InitializeMint",
    "Instruction: CloseAccount",
  ];

  const meaningfulKeywords = [
    "Instruction: Transfer",
    "Instruction: Swap",
    "Instruction: MintTo",
    "Instruction: Burn",
  ];

  const hasSetupLog = logs.some((log) =>
    setupKeywords.some((keyword) => log.includes(keyword))
  );
  const hasMeaningfulLog = logs.some((log) =>
    meaningfulKeywords.some((keyword) => log.includes(keyword))
  );

  return hasSetupLog && !hasMeaningfulLog;
}

function detectTransactionType(
  instruction: ParsedInstruction,
  tokensAccountStr: Map<string, null>
): Transaction["type"] {
  const { type, info } = instruction.parsed;

  if (!info) {
    return "Other";
  }

  if (
    tokensAccountStr.has(info.destination) ||
    tokensAccountStr.has(info.source)
  ) {
    if (type === "transfer" && info.lamports) {
      if (tokensAccountStr.has(info.destination)) return "Receive";
      if (tokensAccountStr.has(info.source)) return "Send";
    }

    if (type === "transfer" || type === "transferChecked") {
      if (tokensAccountStr.has(info.destination)) return "Receive";
      if (tokensAccountStr.has(info.source)) return "Send";
    }
  }

  if (type === "mintTo" || type === "mintToChecked") {
    return "Mint";
  }

  if (
    swapPrograms.includes(instruction.programId.toBase58()) ||
    type === "Transfer"
  ) {
    return "Swap";
  }

  return "Other";
}

function extractTokenAmountsFromBalanceChanges(
  tx: ParsedTransaction,
  tokensAccountStr: Map<string, null>,
  walletPubKey: PublicKey,
  instructions: (ParsedInstruction | PartiallyDecodedInstruction)[]
): {
  amount: number;
  symbol: string;
  address: string;
  type: Transaction["type"];
  mint: string;
}[] {
  const preTokenBalances = tx.meta?.preTokenBalances || [];
  const postTokenBalances = tx.meta?.postTokenBalances || [];

  const preBalanceMap = new Map<string, TokenBalance>();
  preTokenBalances.forEach((balance: TokenBalance) => {
    const key = `${balance.accountIndex}-${balance.mint}`;
    preBalanceMap.set(key, balance);
  });

  const transfers: {
    amount: number;
    symbol: string;
    address: string;
    type: Transaction["type"];
    mint: string;
  }[] = [];

  // detect mint transaction
  const isMintTransaction = instructions.some(
    (inst) =>
      "parsed" in inst &&
      inst.parsed &&
      (inst.parsed.type === "mintTo" || inst.parsed.type === "mintToChecked")
  );

  for (const postBalance of postTokenBalances) {
    const key = `${postBalance.accountIndex}-${postBalance.mint}`;
    const preBalance = preBalanceMap.get(key);

    const accountKeys = tx.transaction.message.accountKeys;
    const accountAddress = accountKeys[postBalance.accountIndex];
    const decimals = postBalance.uiTokenAmount.decimals;
    const postAmount = parseFloat(postBalance.uiTokenAmount.amount);
    const preAmount = preBalance
      ? parseFloat(preBalance.uiTokenAmount.amount)
      : 0;
    const diff = postAmount - preAmount;

    if (diff === 0) continue;

    const transferAmount = Math.abs(diff) / Math.pow(10, decimals);

    let type: Transaction["type"] = "Other";
    if (diff > 0) {
      type = isMintTransaction ? "Mint" : "Receive";
    } else {
      type = "Send";
    }

    transfers.push({
      amount: transferAmount,
      symbol: postBalance.mint.slice(0, 6),
      address: accountAddress || "",
      type,
      mint: postBalance.mint,
    });
  }

  return transfers;
}

function limitTransactionsPerSignature(
  transactions: Transaction[],
  maxPerSignature: number = 2
): Transaction[] {
  const signatureGroups = new Map<string, Transaction[]>();

  // Group transactions by signature
  transactions.forEach((tx) => {
    if (!signatureGroups.has(tx.id)) {
      signatureGroups.set(tx.id, []);
    }
    signatureGroups.get(tx.id)!.push(tx);
  });

  // Keep only the last N transactions for each signature
  const limitedTransactions: Transaction[] = [];
  signatureGroups.forEach((txGroup, signature) => {
    // Sort by date descending and take the last N
    const sortedGroup = txGroup.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    const limitedGroup = sortedGroup.slice(0, maxPerSignature);
    limitedTransactions.push(...limitedGroup);
  });

  // Sort final result by date descending
  return limitedTransactions.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function useTransactionHistory(
  publicKey: string | null,
  pageSize: number | undefined = 10
) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [beforeSig, setBeforeSig] = useState<string | undefined>(undefined);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [total, setTotal] = useState<number | null>(null);
  
  const fetchTransactions = useCallback(async () => {
    if (!publicKey || isLoading || !hasMore) {
      setTransactions([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    const mintsInfo = new Map<
      string,
      AccountInfo<Buffer | ParsedAccountData> | null
    >();
    const tokensAccountAddr = new Map<string, null>();

    try {
      const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
      const walletPubKey = new PublicKey(publicKey);

      if (beforeSig === undefined) {
        try {
          let allSignaturesCount = 0;
          let lastSignature: string | undefined = undefined;
          let keepFetching = true;

          while (keepFetching) {
            const signaturesBatch = await connection.getSignaturesForAddress(
              walletPubKey,
              {
                limit: 1000,
                before: lastSignature,
              }
            );

            allSignaturesCount += signaturesBatch.length;

            if (signaturesBatch.length < 1000) {
              keepFetching = false;
            } else {
              lastSignature =
                signaturesBatch[signaturesBatch.length - 1].signature;
            }
          }
          setTotal(allSignaturesCount);
        } catch (e) {
          console.error("Error fetching total transaction count:", e);
        }
      }
      
      const [token2022Accounts] = await Promise.all([
        connection.getParsedTokenAccountsByOwner(walletPubKey, {
          programId: new PublicKey(TOKEN_2022_PROGRAM_ADDRESS),
        }),
      ]);

      tokensAccountAddr.set(walletPubKey.toString(), null);
      token2022Accounts.value.map((tokenAccount) =>
        tokensAccountAddr.set(tokenAccount.pubkey.toString(), null)
      );

      const txList: Transaction[] = [];
      // let processedSignatures = 0;
      // Fetch more signatures to account for potential filtering and limiting
      const fetchLimit = Math.max(pageSize * 2, 20); // Fetch at least 2x the desired page size
      
      while (txList.length < pageSize && hasMore) {
        const options: SignaturesForAddressOptions = {
          limit: fetchLimit,
          before: beforeSig,
        };

        const signatures = await connection.getSignaturesForAddress(
          walletPubKey,
          options
        );

        console.log("Sign:", signatures);
        
        if (signatures.length === 0) {
          setHasMore(false);
          break;
        }
        
        // Update beforeSig for next batch
        setBeforeSig(signatures[signatures.length - 1].signature);
        
        if (signatures.length < fetchLimit) {
          setHasMore(false);
        }

        for (const sigInfo of signatures) {
          if (txList.length >= pageSize) break;
          
          const tx = (await connection.getParsedTransaction(sigInfo.signature, {
            maxSupportedTransactionVersion: 0,
          })) as ParsedTransaction | null;

          await new Promise((res) => setTimeout(res, 200));

          if (!tx || !tx.blockTime) continue;

          if (isSetupTransactionByLogs(tx.meta?.logMessages)) {
            console.log(
              `Skipping setup transaction by logs: ${sigInfo.signature}`
            );
            continue;
          }

          let type: Transaction["type"] = "Other";
          let amount = 0;
          let address = "";
          let assetSymbol = "N/A";
          const blockTimeSec = tx.blockTime ?? sigInfo.blockTime ?? 0;
          const transactionFeeLamports = tx.meta?.fee ?? 0;

          if (tx.meta?.err) {
            const errorTx: Transaction = {
              id: sigInfo.signature,
              type: "Other",
              assetSymbol,
              amount,
              value: 0,
              status: "Failed",
              date: new Date(blockTimeSec * 1000).toISOString(),
              address: "",
            };
            txList.push(errorTx);
            continue;
          }

          const inner =
            tx.meta?.innerInstructions?.flatMap((i) => i.instructions) ?? [];

          let foundValidInstruction = false;
          const instructions = [...tx.transaction.message.instructions, ...inner];
          console.log("Int: ", instructions);
          
          const tokenBalanceChanges = extractTokenAmountsFromBalanceChanges(
            tx,
            tokensAccountAddr,
            walletPubKey,
            instructions
          );
          
          if (tokenBalanceChanges.length > 0) {
            // Limit the number of transactions per signature to 2
            const limitedChanges = tokenBalanceChanges.slice(0, 2);
            
            for (const change of limitedChanges) {
              if (txList.length >= pageSize) break;
              
              type = change.type;
              amount = change.amount;
              address = change.address;
              assetSymbol = change.symbol;

              const mint = change.mint;
              if (mint && !mintsInfo.has(mint)) {
                try {
                  const mintAccount = await connection.getParsedAccountInfo(
                    new PublicKey(mint)
                  );
                  mintsInfo.set(mint, mintAccount.value);
                } catch (e) {
                  console.warn("Could not fetch mint info for", mint);
                }
              }

              if (mint && mintsInfo.get(mint)?.data) {
                const mintData = mintsInfo.get(mint)?.data as ParsedAccountData;
                const parsedInfo = mintData.parsed?.info as MintInfo;
                const extensions = parsedInfo?.extensions;
                if (extensions) {
                  for (const ext of extensions) {
                    if (ext.extension === "tokenMetadata") {
                      assetSymbol = ext.state.symbol || assetSymbol;
                      break;
                    }
                  }
                }
              }

              txList.push({
                id: sigInfo.signature,
                type,
                assetSymbol: assetSymbol || "N/A",
                amount,
                value: 0,
                status:
                  sigInfo.confirmationStatus === "confirmed" ||
                  sigInfo.confirmationStatus === "finalized"
                    ? "Completed"
                    : "Pending",
                date: new Date(blockTimeSec * 1000).toISOString(),
                address,
              });
            }
            continue;
          }

          if (!foundValidInstruction) {
            const walletIndex = tx.transaction.message.accountKeys.findIndex(
              (key) => key === walletPubKey.toBase58()
            );

            if (walletIndex !== -1 && tx.meta) {
              const preBalance = tx.meta.preBalances[walletIndex];
              const postBalance = tx.meta.postBalances[walletIndex];
              const solChange = postBalance - preBalance;

              if (Math.abs(solChange) > 5) {
                if (solChange > 0) {
                  amount = solChange / LAMPORTS_PER_SOL;
                  assetSymbol = "SOL";
                  type = "Receive";
                  foundValidInstruction = true;
                } else if (solChange < 0) {
                  const amountSentLamports =
                    Math.abs(solChange) - transactionFeeLamports;

                  if (amountSentLamports > 5) {
                    amount = amountSentLamports / LAMPORTS_PER_SOL;
                    assetSymbol = "SOL";
                    type = "Send";
                    foundValidInstruction = true;
                  }
                }
              }
            }
          }

          if (!foundValidInstruction) {
            for (const instruction of instructions as ParsedInstruction[]) {
              if (!("parsed" in instruction)) continue;
              if (
                instruction.parsed?.info?.destination === walletPubKey.toBase58()
              ) {
                type = "Other";
                assetSymbol = "SOL";
                address = instruction.parsed.info.account;
              }
              const detectedType = detectTransactionType(
                instruction,
                tokensAccountAddr
              );

              if (detectedType !== "Other") {
                type = detectedType;
                foundValidInstruction = true;
              }

              if (
                instruction.parsed.type === "transfer" &&
                instruction.parsed.info?.lamports
              ) {
                amount = instruction.parsed.info.lamports / LAMPORTS_PER_SOL;
                assetSymbol = "SOL";
                address =
                  instruction.parsed.info.destination ||
                  instruction.parsed.info.source ||
                  "";
                foundValidInstruction = true;
              }

              if (
                (instruction.parsed.type === "transferChecked" ||
                  instruction.parsed.type === "transfer") &&
                instruction.parsed.info?.tokenAmount
              ) {
                const t = instruction.parsed.info.tokenAmount;
                amount =
                  typeof t.uiAmount === "number"
                    ? t.uiAmount
                    : Number(t.amount) / Math.pow(10, t.decimals || 0);
                address =
                  instruction.parsed.info.destination ||
                  instruction.parsed.info.source ||
                  "";

                if (
                  instruction.parsed.info.mint &&
                  !mintsInfo.has(instruction.parsed.info.mint)
                ) {
                  try {
                    const mintAccount = await connection.getParsedAccountInfo(
                      new PublicKey(instruction.parsed.info.mint)
                    );

                    mintsInfo.set(
                      instruction.parsed.info.mint,
                      mintAccount.value
                    );
                  } catch (e) {
                    console.warn(
                      "Could not fetch mint info for",
                      instruction.parsed.info.mint
                    );
                  }
                }

                if (
                  instruction.parsed.info.mint &&
                  mintsInfo.get(instruction.parsed.info.mint)?.data
                ) {
                  const mintData = mintsInfo.get(instruction.parsed.info.mint)
                    ?.data as ParsedAccountData;
                  const parsedInfo = mintData.parsed?.info as MintInfo;
                  const extensions = parsedInfo?.extensions;
                  if (extensions) {
                    for (const ext of extensions) {
                      if (ext.extension === "tokenMetadata") {
                        assetSymbol = ext.state.symbol || "N/A";
                        break;
                      }
                    }
                  }
                } else {
                  assetSymbol = instruction.parsed.info.mint
                    ? instruction.parsed.info.mint.slice(0, 6)
                    : "SPL";
                }
                foundValidInstruction = true;
              }

              if (
                instruction.parsed.type === "mintTo" ||
                instruction.parsed.type === "mintToChecked"
              ) {
                if (instruction.parsed.info?.tokenAmount) {
                  const t = instruction.parsed.info.tokenAmount;

                  amount =
                    typeof t.uiAmount === "number"
                      ? t.uiAmount
                      : Number(t.amount) / Math.pow(10, t.decimals || 0);
                } else {
                  const raw =
                    instruction.parsed.info?.amount ??
                    instruction.parsed.info?.mintAmount ??
                    0;

                  let decimals = 0;

                  if (instruction.parsed.info?.mint) {
                    const mintAddr = instruction.parsed.info.mint;

                    if (!mintsInfo.has(mintAddr)) {
                      try {
                        const mintAccount = await connection.getParsedAccountInfo(
                          new PublicKey(mintAddr)
                        );

                        mintsInfo.set(mintAddr, mintAccount.value);
                      } catch (e) {
                        console.warn("Could not fetch mint info for", mintAddr);
                      }
                    }

                    const mintData = mintsInfo.get(instruction.parsed.info.mint)
                      ?.data as ParsedAccountData | undefined;

                    const parsedInfo = mintData?.parsed?.info as
                      | MintInfo
                      | undefined;
                    decimals = parsedInfo?.decimals ?? 0;
                  }
                  amount = Number(raw) / Math.pow(10, decimals || 0);
                }
                address =
                  instruction.parsed.info?.account ||
                  instruction.parsed.info?.destination ||
                  instruction.parsed.info?.source ||
                  "";

                if (
                  instruction.parsed.info?.mint &&
                  !mintsInfo.has(instruction.parsed.info.mint)
                ) {
                  try {
                    const mintAccount = await connection.getParsedAccountInfo(
                      new PublicKey(instruction.parsed.info.mint)
                    );

                    mintsInfo.set(
                      instruction.parsed.info.mint,
                      mintAccount.value
                    );
                  } catch (e) {
                    console.warn(
                      "Could not fetch mint info for",
                      instruction.parsed.info.mint
                    );
                  }
                }
                if (
                  instruction.parsed.info?.mint &&
                  mintsInfo.get(instruction.parsed.info.mint)?.data
                ) {
                  const mintData = mintsInfo.get(instruction.parsed.info.mint)
                    ?.data as ParsedAccountData;
                  const extensions = mintData.parsed?.info?.extensions;

                  if (extensions) {
                    for (const ext of extensions) {
                      if (ext.extension === "tokenMetadata") {
                        assetSymbol = ext.state.symbol || "N/A";
                        break;
                      }
                    }
                  }
                } else {
                  assetSymbol = instruction.parsed.info?.mint
                    ? instruction.parsed.info.mint.slice(0, 6)
                    : "SPL";
                }
                foundValidInstruction = true;
              }

              if (foundValidInstruction) break;
            }
          }
          
          if (assetSymbol === "SOL" && amount < 0.00001 && type === "Send") {
            continue;
          }

          txList.push({
            id: sigInfo.signature,
            type,
            assetSymbol: assetSymbol || "N/A",
            amount,
            value: 0,
            status:
              sigInfo.confirmationStatus === "confirmed" ||
              sigInfo.confirmationStatus === "finalized"
                ? "Completed"
                : "Pending",
            date: new Date(blockTimeSec * 1000).toISOString(),
            address,
          });
        }
        
        // If we haven't reached the page size and don't have more signatures, break
        if (signatures.length < fetchLimit) {
          break;
        }
      }

      console.log(`Final transaction list length: ${txList.length}`);
      
      // Sort transactions by date descending
      const sortedTxList = txList.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      setTransactions((prev) => [...prev, ...sortedTxList]);
    } catch (e) {
      console.error("Error fetching transactions:", e);
      setError(e instanceof Error ? e : new Error("An unknown error occurred"));
    } finally {
      setIsLoading(false);
    }
  }, [publicKey, pageSize, isLoading, hasMore, beforeSig]);

  useEffect(() => {
    if (!publicKey) {
      setTransactions([]);
      setIsLoading(false);
      return;
    }
    setTransactions([]);
    setBeforeSig(undefined);
    setHasMore(true);
    setTotal(null);
    (async () => {
      await fetchTransactions();
    })();
  }, [publicKey]);

  return { transactions, isLoading, error, hasMore, fetchTransactions, total };
}