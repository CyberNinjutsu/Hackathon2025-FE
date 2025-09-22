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
  SystemProgram,
} from "@solana/web3.js";
import { TOKEN_2022_PROGRAM_ADDRESS } from "@solana-program/token-2022";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_2022_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { Transaction } from "./Types";

const swapPrograms = [
  "9xQeWvG816bUx9EPfDdG9w7d6dXKJbTgkGMwzV3bRjP7", // Serum DEX
  "RVKd61ztZW9CdCtzZ9Gx8JepQ2iwtrtUmkfmAxs2gF7", // Raydium
  "9WwFFoJDP9N6hGPBhv1L6J7wS2tZJgJGnDzvx2Vhzy4k", // Orca
  "JUP6LkbZbjS4tYqbNrtYmNHJvZs3Kox7c3M1TUPNQm8", // Jupiter
];

// Known fee-related accounts
const feeRelatedAccounts = new Set(["11111111111111111111111111111111"]);

function isLikelyFeeTransaction(
  instruction: ParsedInstruction,
  tokensAccountStr: Map<string, null> | null,
  transactionFee: number
): boolean {
  const { type, info } = instruction.parsed;
  if (!info) return false;

  if (instruction.programId.equals(ComputeBudgetProgram.programId)) {
    return true;
  }

  if (instruction.programId.equals(ASSOCIATED_TOKEN_PROGRAM_ID)) {
    if ("parsed" in instruction && instruction.parsed?.type === "create") {
      return true;
    }
  }

  if (instruction.programId.equals(SystemProgram.programId)) {
    if ("parsed" in instruction && instruction.parsed) {
      const { type, info } = instruction.parsed;

      if (type === "transfer" && info?.lamports) {
        const amountSol = info.lamports / LAMPORTS_PER_SOL;
        const transferAmountSol = info.lamports / LAMPORTS_PER_SOL;
        const feeAmountSol = transactionFee / LAMPORTS_PER_SOL;
        if (amountSol < 0.0000000003) {
          return true;
        }
      }

      if (type === "createAccount") {
        return true;
      }
    }
    if (type === "transfer" && info.lamports) {
      const transferAmount = info.lamports / LAMPORTS_PER_SOL;
      const feeAmount = transactionFee / LAMPORTS_PER_SOL;

      if (transferAmount <=  1e-9 && Math.abs(transferAmount - feeAmount) <  1e-9) {
        return true;
      }

      if (transferAmount < 0.0000000000001) {
        return true;
      }
    }
  }
  if (feeRelatedAccounts.has(info.source) || feeRelatedAccounts.has(info.destination)) {
    return true;
  }
  return false;
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

  if (swapPrograms.includes(instruction.programId.toBase58())) {
    return "Swap";
  }

  return "Other";
}

interface TokenBalance {
  accountIndex: number;
  mint: string;
  owner: string;
  programId: string;
  uiTokenAmount: {
    amount: string;
    decimals: number;
    uiAmount: number | null;
    uiAmountString: string;
  };
}

interface TokenMetadataExtension {
  extension: string;
  state: {
    symbol?: string;
    name?: string;
  };
}

interface MintInfo {
  decimals: number;
  extensions?: TokenMetadataExtension[];
}

interface TransactionMeta {
  err: string | null;
  fee: number;
  preTokenBalances: TokenBalance[];
  postTokenBalances: TokenBalance[];
  preBalances: number[];
  postBalances: number[];
  innerInstructions?: Array<{ instructions: ParsedInstruction[] }>;
  computeUnitsConsumed: number;
}

interface ParsedTransaction {
  meta: TransactionMeta | null;
  blockTime: number | null;
  transaction: {
    message: {
      accountKeys: string[];
      instructions: ParsedInstruction[];
    };
  };
}

function extractTokenAmountFromBalanceChanges(
  tx: ParsedTransaction,
  tokensAccountStr: Map<string, null>,
  walletPubKey: PublicKey,
  instructions: (ParsedInstruction | PartiallyDecodedInstruction)[] // <-- ADD THIS PARAMETER
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

    if ( !preBalance && postBalance.uiTokenAmount.uiAmount && postBalance.uiTokenAmount.uiAmount > 0) {
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

    const transferAmount =Math.abs(difference) / Math.pow(10, postBalance.uiTokenAmount.decimals);

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
// Custom Hook
export function useTransactionHistory(
  publicKey: string | null,
  limit: number | null = 1000
) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchTransactions = useCallback(async () => {
    if (!publicKey) {
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

      const fetchLimit = limit === null ? 1000 : limit;


      const [legacyTokenAccounts, token2022Accounts ]= await Promise.all([

        connection.getParsedTokenAccountsByOwner(walletPubKey,{ programId: new PublicKey(TOKEN_2022_PROGRAM_ID) }),
        connection.getParsedTokenAccountsByOwner(walletPubKey,{ programId: new PublicKey(TOKEN_PROGRAM_ID) })
      ])
      
      const signatures = await connection.getSignaturesForAddress(
        walletPubKey,
        { limit: fetchLimit }
      );

      tokensAccountAddr.set(walletPubKey.toString(), null);
      token2022Accounts.value.map((tokenAccount) => tokensAccountAddr.set(tokenAccount.pubkey.toString(), null));

      const txList: Transaction[] = [];

      for (const sigInfo of signatures) {
        if (limit !== null && txList.length >= limit) break;

        const tx = (await connection.getParsedTransaction(sigInfo.signature, {
          maxSupportedTransactionVersion: 0,
        })) as ParsedTransaction | null;

        if (!tx || !tx.blockTime) continue;

        const baseFeeLamports = tx.meta?.fee ?? 0;

        let microLamportsPerCu = 0;
        for (const inst of tx.transaction.message.instructions as ParsedInstruction[]) {
          if (inst.programId.equals(ComputeBudgetProgram.programId) && inst.parsed?.type === "setComputeUnitPrice") {
            microLamportsPerCu = inst.parsed.info.microLamports;
            break;
          }
        }

        const computeUnitsConsumed = tx.meta?.computeUnitsConsumed ?? 0;
        const priorityFeeInLamports = microLamportsPerCu > 0 ? (computeUnitsConsumed * microLamportsPerCu) / 1000000 : 0;

        let type: Transaction["type"] = "Other";
        let amount = 0;
        let address = "";
        let assetSymbol = "N/A";
        const blockTimeSec = tx.blockTime ?? sigInfo.blockTime ?? 0;
        const transactionFeeLamports = tx.meta?.fee ?? 0;
        const transactionFeeSOL = transactionFeeLamports / LAMPORTS_PER_SOL;

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
            fee: transactionFeeSOL,
          });
          continue;
        }

        const inner =
          tx.meta?.innerInstructions?.flatMap((i) => i.instructions) ?? [];
        const instructions = [...tx.transaction.message.instructions, ...inner];
        let foundValidInstruction = false;
        const isFeeTransaction = false;

        const hasMeaningfulInstruction = instructions.some((inst) => "parsed" in inst && !isLikelyFeeTransaction(inst, tokensAccountAddr, transactionFeeLamports));
        if (!hasMeaningfulInstruction) {
          continue;
        }
         const isFeeOnly = !foundValidInstruction && !hasMeaningfulInstruction && amount === 0;
        const tokenBalanceChange = extractTokenAmountFromBalanceChanges(
          tx,
          tokensAccountAddr,
          walletPubKey,
          instructions
        );
        if (tokenBalanceChange) {
          type = tokenBalanceChange.type;
          amount = tokenBalanceChange.amount;
          address = tokenBalanceChange.address;
          assetSymbol = tokenBalanceChange.symbol;
          foundValidInstruction = true;

          // Try to get the actual token symbol from mint info
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
        if (!foundValidInstruction && priorityFeeInLamports > 0) {
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

          if (microLamportsPerCu > 0) {
            const computeUnitsConsumed = tx.meta?.computeUnitsConsumed ?? 0;

            const priorityFeeInLamports = (computeUnitsConsumed * microLamportsPerCu) / 1_000_000;

            if (priorityFeeInLamports > 0) {
              amount = priorityFeeInLamports / LAMPORTS_PER_SOL;
              assetSymbol = "SOL"; 
              type = "Other"; 
              foundValidInstruction = true; 
            }
          }
        }
        if (!foundValidInstruction) {
          for (const instruction of instructions as ParsedInstruction[]) {
            if (!("parsed" in instruction)) continue;
            if (
              (instruction.programId.equals(TOKEN_PROGRAM_ID) ||
              instruction.programId.equals(TOKEN_2022_PROGRAM_ID)) &&
              instruction.parsed?.type === "closeAccount" &&
              instruction.parsed?.info?.destination === walletPubKey.toBase58()
            ) {
              type = "Other";
              assetSymbol = "SOL";
              address = instruction.parsed.info.account;
            }
            const detectedType = detectTransactionType(instruction, tokensAccountAddr);

            if (detectedType !== "Other") {
              type = detectedType;
              foundValidInstruction = true;
            }

            if (instruction.parsed.type === "transfer" &&instruction.parsed.info?.lamports) {
              amount = instruction.parsed.info.lamports / LAMPORTS_PER_SOL;
              assetSymbol = "SOL";
              address =instruction.parsed.info.destination || instruction.parsed.info.source ||"";
              foundValidInstruction = true;
            }

            if ((instruction.parsed.type === "transferChecked" || instruction.parsed.type === "transfer") && instruction.parsed.info?.tokenAmount) {
              const t = instruction.parsed.info.tokenAmount;
              amount = typeof t.uiAmount === "number" ? t.uiAmount : Number(t.amount) / Math.pow(10, t.decimals || 0);
              address =instruction.parsed.info.destination || instruction.parsed.info.source || "";

              if (instruction.parsed.info.mint && !mintsInfo.has(instruction.parsed.info.mint)) {
                try {
                  const mintAccount = await connection.getParsedAccountInfo(new PublicKey(instruction.parsed.info.mint));
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

              if (instruction.parsed.info.mint &&mintsInfo.get(instruction.parsed.info.mint)?.data) {
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

            if (
              instruction.parsed.type === "mintTo" || instruction.parsed.type === "mintToChecked"
            ) {
              if (instruction.parsed.info?.tokenAmount) {
                const t = instruction.parsed.info.tokenAmount;
                amount =typeof t.uiAmount === "number" ? t.uiAmount : Number(t.amount) / Math.pow(10, t.decimals || 0);
              } else {
                const raw = instruction.parsed.info?.amount ?? instruction.parsed.info?.mintAmount ?? 0;
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
                  mintsInfo.set(instruction.parsed.info.mint,mintAccount.value);
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
        if (
          assetSymbol === "SOL" &&
          amount < 0.00000000001 &&
          type === "Send"
        ) {
          continue;
        }
        if (!isFeeOnly && type === "Other" && amount === 0) {
          const hasComputeBudgetInstruction = instructions.some((inst) =>
            inst.programId.equals(ComputeBudgetProgram.programId)
          );

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
          fee: transactionFeeSOL,
          isFeeOnly: isFeeOnly
        });
      }

      console.log(`Final transaction list length: ${txList.length}`);

      const sortedTxList = txList.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      const finalList =
        limit !== null ? sortedTxList.slice(0, limit) : sortedTxList;
      setTransactions(finalList);
    } catch (e) {
      console.error("Error fetching transactions:", e);
      setError(e instanceof Error ? e : new Error("An unknown error occurred"));
    } finally {
      setIsLoading(false);
    }
  }, [publicKey, limit]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return { transactions, isLoading, error, refetch: fetchTransactions };
}
