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

  const hasSetupLog = logs.some((log) => setupKeywords.some((keyword) => log.includes(keyword)));
  const hasMeaningfulLog = logs.some((log) => meaningfulKeywords.some((keyword) => log.includes(keyword)));

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

  if (tokensAccountStr.has(info.destination) || tokensAccountStr.has(info.source)) {
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

  if (swapPrograms.includes(instruction.programId.toBase58()) || type === "Transfer") {
    return "Swap";
  }

  return "Other";
}

function extractTokenAmountFromBalanceChanges(
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
} | null {
  const preTokenBalances = tx.meta?.preTokenBalances || [];
  const postTokenBalances = tx.meta?.postTokenBalances || [];

  // Create maps for easier lookup
  const preBalanceMap = new Map<string, TokenBalance>();
  const postBalanceMap = new Map<string, TokenBalance>();

  preTokenBalances.forEach((balance: TokenBalance) => {
    const key = `${balance.accountIndex}-${balance.mint}`;
    preBalanceMap.set(key, balance);
  });

  postTokenBalances.forEach((balance: TokenBalance) => {
    const key = `${balance.accountIndex}-${balance.mint}`;
    postBalanceMap.set(key, balance);
  });

  const isMintTransaction = instructions.some(
    (inst) =>
      "parsed" in inst &&
      inst.parsed &&
      (inst.parsed.type === "mintTo" || inst.parsed.type === "mintToChecked")
  );

  for (const postBalance of postTokenBalances) {
    const key = `${postBalance.accountIndex}-${postBalance.mint}`;
    const preBalance = preBalanceMap.get(key);

    if (
      !preBalance &&
      postBalance.uiTokenAmount.uiAmount &&
      postBalance.uiTokenAmount.uiAmount > 0
    ) {
      const accountKeys = tx.transaction.message.accountKeys;
      const accountAddress = accountKeys[postBalance.accountIndex];

      return {
        amount: postBalance.uiTokenAmount.uiAmount,
        symbol: postBalance.mint.slice(0, 6),
        address: accountAddress || "",
        type: isMintTransaction ? "Mint" : "Receive",
        mint: postBalance.mint,
      };
    }
  }

  for (const postBalance of postTokenBalances) {
    const key = `${postBalance.accountIndex}-${postBalance.mint}`;
    const preBalance = preBalanceMap.get(key);

    if (!preBalance) continue;

    const preAmount = parseFloat(preBalance.uiTokenAmount.amount);
    const postAmount = parseFloat(postBalance.uiTokenAmount.amount);
    const difference = postAmount - preAmount;

    if (difference === 0) continue;

    const accountKeys = tx.transaction.message.accountKeys;
    const accountAddress = accountKeys[postBalance.accountIndex];

    const transferAmount =
      Math.abs(difference) / Math.pow(10, postBalance.uiTokenAmount.decimals);

    if (difference > 0) {
      const transactionType = isMintTransaction ? "Mint" : "Receive";

      return {
        amount: transferAmount,
        symbol: postBalance.mint.slice(0, 6),
        address: accountAddress || "",
        type: transactionType,
        mint: postBalance.mint,
      };
    } else if (difference < 0) {
      return {
        amount: transferAmount,
        symbol: postBalance.mint.slice(0, 6),
        address: accountAddress || "",
        type: "Send",
        mint: postBalance.mint,
      };
    }
  }

  return null;
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

      // const fetchLimit = limit === null ? 10 : limit;

      const [token2022Accounts] = await Promise.all([
        connection.getParsedTokenAccountsByOwner(walletPubKey, {
          programId: new PublicKey(TOKEN_2022_PROGRAM_ADDRESS),
        }),
      ]);

      tokensAccountAddr.set(walletPubKey.toString(), null);
      token2022Accounts.value.map((tokenAccount) =>
        tokensAccountAddr.set(tokenAccount.pubkey.toString(), null)
      );

      const options: SignaturesForAddressOptions = {
        limit: pageSize,
        before: beforeSig,
      };

      const signatures = await connection.getSignaturesForAddress(
        walletPubKey,
        options
      );

      if (signatures.length < pageSize) {
        setHasMore(false);
      }
      if (signatures.length > 0) {
        setBeforeSig(signatures[signatures.length - 1].signature);
      } else {
        setHasMore(false);
        setIsLoading(false);
        return;
      }

      const txList: Transaction[] = [];

      for (const sigInfo of signatures) {
        if (txList.length >= pageSize) break;
        const tx = (await connection.getParsedTransaction(sigInfo.signature, { maxSupportedTransactionVersion: 0, })) as ParsedTransaction | null;

        await new Promise((res) => setTimeout(res, 200));

        if (!tx || !tx.blockTime) continue;

        if (isSetupTransactionByLogs(tx.meta?.logMessages)) {
          console.log(`Skipping setup transaction by logs: ${sigInfo.signature}`);
          continue;
        }

        let type: Transaction["type"] = "Other";
        let amount = 0;
        let address = "";
        let assetSymbol = "N/A";
        const blockTimeSec = tx.blockTime ?? sigInfo.blockTime ?? 0;
        const transactionFeeLamports = tx.meta?.fee ?? 0;

        if (tx.meta?.err) {
          txList.push({
            id: sigInfo.signature,
            type: "Other",
            assetSymbol,
            amount,
            value: 0,
            status: "Failed",
            date: new Date(blockTimeSec * 1000).toISOString(),
            address: "",
          });
          continue;
        }

        const inner = tx.meta?.innerInstructions?.flatMap((i) => i.instructions) ?? [];
        const instructions = [...tx.transaction.message.instructions, ...inner];
        let foundValidInstruction = false;

        const tokenBalanceChange = extractTokenAmountFromBalanceChanges(tx, tokensAccountAddr, walletPubKey, instructions);

        if (tokenBalanceChange) {
          type = tokenBalanceChange.type;
          amount = tokenBalanceChange.amount;
          address = tokenBalanceChange.address;
          assetSymbol = tokenBalanceChange.symbol;
          foundValidInstruction = true;

          const mint = tokenBalanceChange.mint;

          if (mint && !mintsInfo.has(mint)) {
            try {
              const mintAccount = await connection.getParsedAccountInfo(new PublicKey(mint));

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
        }
        if (!foundValidInstruction) {
          const walletIndex = tx.transaction.message.accountKeys.findIndex((key) => key === walletPubKey.toBase58());

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
                const amountSentLamports = Math.abs(solChange) - transactionFeeLamports;

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
          let microLamportsPerCu = 0;
          for (const inst of instructions as ParsedInstruction[]) {
            if (
              inst.programId.equals(ComputeBudgetProgram.programId) &&
              inst.parsed?.type === "setComputeUnitPrice"
            ) {
              microLamportsPerCu = inst.parsed.info.microLamports;
              break;
            }
          }


        }
        if (!foundValidInstruction) {
          for (const instruction of instructions as ParsedInstruction[]) {
            if (!("parsed" in instruction)) continue;
            if (instruction.parsed?.info?.destination === walletPubKey.toBase58()) {
              type = "Other";
              assetSymbol = "SOL";
              address = instruction.parsed.info.account;
            }
            const detectedType = detectTransactionType(instruction, tokensAccountAddr);

            if (detectedType !== "Other") {
              type = detectedType;
              foundValidInstruction = true;
            }

            if (instruction.parsed.type === "transfer" && instruction.parsed.info?.lamports) {

              amount = instruction.parsed.info.lamports / LAMPORTS_PER_SOL;
              assetSymbol = "SOL";
              address = instruction.parsed.info.destination || instruction.parsed.info.source || "";
              foundValidInstruction = true;
            }

            if (
              (instruction.parsed.type === "transferChecked" || instruction.parsed.type === "transfer") && instruction.parsed.info?.tokenAmount) {
              const t = instruction.parsed.info.tokenAmount;
              amount = typeof t.uiAmount === "number" ? t.uiAmount : Number(t.amount) / Math.pow(10, t.decimals || 0);
              address = instruction.parsed.info.destination || instruction.parsed.info.source || "";

              if (instruction.parsed.info.mint && !mintsInfo.has(instruction.parsed.info.mint)) {
                try {
                  const mintAccount = await connection.getParsedAccountInfo(new PublicKey(instruction.parsed.info.mint));

                  mintsInfo.set(instruction.parsed.info.mint, mintAccount.value);
                } catch (e) {
                  console.warn("Could not fetch mint info for", instruction.parsed.info.mint);
                }
              }

              if (instruction.parsed.info.mint && mintsInfo.get(instruction.parsed.info.mint)?.data) {
                const mintData = mintsInfo.get(instruction.parsed.info.mint)?.data as ParsedAccountData;
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
                assetSymbol = instruction.parsed.info.mint ? instruction.parsed.info.mint.slice(0, 6) : "SPL";
              }
              foundValidInstruction = true;
            }

            if (instruction.parsed.type === "mintTo" || instruction.parsed.type === "mintToChecked") {
              if (instruction.parsed.info?.tokenAmount) {

                const t = instruction.parsed.info.tokenAmount;

                amount = typeof t.uiAmount === "number" ? t.uiAmount : Number(t.amount) / Math.pow(10, t.decimals || 0);
              } else {
                const raw = instruction.parsed.info?.amount ?? instruction.parsed.info?.mintAmount ?? 0;

                let decimals = 0;

                if (instruction.parsed.info?.mint) {

                  const mintAddr = instruction.parsed.info.mint;

                  if (!mintsInfo.has(mintAddr)) {
                    try {

                      const mintAccount = await connection.getParsedAccountInfo(new PublicKey(mintAddr));

                      mintsInfo.set(mintAddr, mintAccount.value);

                    } catch (e) {
                      console.warn("Could not fetch mint info for", mintAddr);
                    }
                  }

                  const mintData = mintsInfo.get(instruction.parsed.info.mint)?.data as ParsedAccountData | undefined;

                  const parsedInfo = mintData?.parsed?.info as | MintInfo | undefined;
                  decimals = parsedInfo?.decimals ?? 0;
                }
                amount = Number(raw) / Math.pow(10, decimals || 0);
              }
              address = instruction.parsed.info?.account || instruction.parsed.info?.destination || instruction.parsed.info?.source || "";

              if (instruction.parsed.info?.mint && !mintsInfo.has(instruction.parsed.info.mint)) {
                try {
                  const mintAccount = await connection.getParsedAccountInfo(new PublicKey(instruction.parsed.info.mint));

                  mintsInfo.set(instruction.parsed.info.mint, mintAccount.value);
                } catch (e) {
                  console.warn(
                    "Could not fetch mint info for",
                    instruction.parsed.info.mint
                  );
                }
              }
              if (instruction.parsed.info?.mint && mintsInfo.get(instruction.parsed.info.mint)?.data) {
                const mintData = mintsInfo.get(instruction.parsed.info.mint)?.data as ParsedAccountData;
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
                assetSymbol = instruction.parsed.info?.mint ? instruction.parsed.info.mint.slice(0, 6) : "SPL";
              }
              foundValidInstruction = true;
            }

            if (foundValidInstruction) break;
          }
        }
        if (assetSymbol === "SOL" && amount < 0.00000000001 && type === "Send") {
          continue;
        }
        if (type === "Other" && amount === 0) {

          const hasComputeBudgetInstruction = instructions.some((inst) => inst.programId.equals(ComputeBudgetProgram.programId));

          if (!hasComputeBudgetInstruction) {
            continue;
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

      console.log(`Final transaction list length: ${txList.length}`);

      setTransactions((prev) => [...prev, ...txList]);

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

    (async () => {
      await fetchTransactions();
    })();;
  }, [publicKey]);

  return { transactions, isLoading, error, hasMore, fetchTransactions };
}