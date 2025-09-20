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
} from "@solana/web3.js";
import { TOKEN_2022_PROGRAM_ADDRESS } from "@solana-program/token-2022";

import { Transaction } from "./Types";

const swapPrograms = [
  "9xQeWvG816bUx9EPfDdG9w7d6dXKJbTgkGMwzV3bRjP7", // Serum DEX
  "RVKd61ztZW9CdCtzZ9Gx8JepQ2iwtrtUmkfmAxs2gF7", // Raydium
  "9WwFFoJDP9N6hGPBhv1L6J7wS2tZJgJGnDzvx2Vhzy4k", // Orca
  "JUP6LkbZbjS4tYqbNrtYmNHJvZs3Kox7c3M1TUPNQm8", // Jupiter
];

function detectTransactionType(instruction: ParsedInstruction, tokensAccountStr: Map<string, null>): Transaction["type"] {
  const { type, info } = instruction.parsed;

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
    const mintsInfo = new Map<string, AccountInfo<Buffer | ParsedAccountData> | null>();
    const tokensAccountAddr = new Map<string, null>();

    try {
      const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
      const walletPubKey = new PublicKey(publicKey);

      const fetchLimit = limit === null ? 1000 : limit;

      const tokensAccount = await connection.getParsedTokenAccountsByOwner(walletPubKey, { programId: new PublicKey(TOKEN_2022_PROGRAM_ADDRESS.toString()) });
      const signatures = await connection.getSignaturesForAddress(walletPubKey, { limit: fetchLimit });

      tokensAccountAddr.set(walletPubKey.toString(), null);
      tokensAccount.value.map(tokenAccount => tokensAccountAddr.set(tokenAccount.pubkey.toString(), null));

      const txList: Transaction[] = [];

      for (const sigInfo of signatures) {
        // THAY ĐỔI: Dừng khi đã có đủ số lượng transaction cần thiết
        if (limit !== null && txList.length >= limit) break;

        const tx = await connection.getParsedTransaction(sigInfo.signature, {
          maxSupportedTransactionVersion: 0,
        });

        if (!tx || !tx.blockTime) continue;

        let type: Transaction["type"] = "Other";
        let amount = 0;
        let address = "";
        let assetSymbol = "N/A";
        const blockTimeSec = tx.blockTime ?? sigInfo.blockTime ?? 0;

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

        for (const instruction of instructions as (| ParsedInstruction | PartiallyDecodedInstruction)[]) {
          if (!("parsed" in instruction)) continue;

          const detectedType = detectTransactionType(instruction, tokensAccountAddr);

          if (detectedType !== "Other") {
            type = detectedType;
            foundValidInstruction = true;
          }

          if (instruction.parsed.type === "transfer" && instruction.parsed.info?.lamports) {
            amount = instruction.parsed.info.lamports / LAMPORTS_PER_SOL;
            assetSymbol = "SOL";
            address =
              instruction.parsed.info.destination ||
              instruction.parsed.info.source ||
              "";
            foundValidInstruction = true;
          }

          if (
            (instruction.parsed.type === "transferChecked" || instruction.parsed.type === "transfer") &&
            instruction.parsed.info?.tokenAmount
          ) {
            const t = instruction.parsed.info.tokenAmount;
            amount = typeof t.uiAmount === "number" ? t.uiAmount : Number(t.amount) / Math.pow(10, t.decimals || 0);
            address = instruction.parsed.info.destination || instruction.parsed.info.source || "";

            if (instruction.parsed.info.mint && !mintsInfo.has(instruction.parsed.info.mint)) {
              const mintAccount = await connection.getParsedAccountInfo(new PublicKey(instruction.parsed.info.mint));
              mintsInfo.set(instruction.parsed.info.mint, mintAccount.value);
            }

            if (instruction.parsed.info.mint && mintsInfo.get(instruction.parsed.info.mint)?.data) {
              const mintData = mintsInfo.get(instruction.parsed.info.mint)?.data as ParsedAccountData;
              const extensions = mintData.parsed?.info?.extensions;
              if (extensions) {
                for (const ext of mintData.parsed?.info?.extensions) {
                  if (ext.extension === "tokenMetadata") {
                    assetSymbol = ext.state.symbol || "N/A";
                    break;
                  }
                }
              }
            }
            else {
              assetSymbol = instruction.parsed.info.mint ? instruction.parsed.info.mint.slice(0, 6) : "SPL";
            }
            foundValidInstruction = true;
          }

          if (instruction.parsed.type === "mintTo" || instruction.parsed.type === "mintToChecked") {
            if (instruction.parsed.info?.tokenAmount) {
              const t = instruction.parsed.info.tokenAmount;
              amount = typeof t.uiAmount === "number" ? t.uiAmount : Number(t.amount) / Math.pow(10, t.decimals || 0);
            }
            else {
              const raw = instruction.parsed.info?.amount ?? instruction.parsed.info?.mintAmount ?? 0;
              let decimals = 0;

              if (instruction.parsed.info?.mint) {
                const mintAddr = instruction.parsed.info.mint;
                if (!mintsInfo.has(mintAddr)) {
                  const mintAccount = await connection.getParsedAccountInfo(new PublicKey(mintAddr));
                  mintsInfo.set(mintAddr, mintAccount.value);
                }

                const mintData = mintsInfo.get(instruction.parsed.info.mint)?.data as ParsedAccountData | undefined;
                decimals = mintData?.parsed?.info?.decimals ?? 0;
              }
              amount = Number(raw) / Math.pow(10, decimals || 0);
            }

            address =
              instruction.parsed.info?.account ||
              instruction.parsed.info?.destination ||
              instruction.parsed.info?.source ||
              "";

            if (instruction.parsed.info?.mint && !mintsInfo.has(instruction.parsed.info.mint)) {
              const mintAccount = await connection.getParsedAccountInfo(new PublicKey(instruction.parsed.info.mint));
              mintsInfo.set(instruction.parsed.info.mint, mintAccount.value);
            }
            if (instruction.parsed.info?.mint && mintsInfo.get(instruction.parsed.info.mint)?.data) {
              const mintData = mintsInfo.get(instruction.parsed.info.mint)?.data as ParsedAccountData; const extensions = mintData.parsed?.info?.extensions;

              if (extensions) {
                for (const ext of mintData.parsed?.info?.extensions) {
                  if (ext.extension === "tokenMetadata") {
                    assetSymbol = ext.state.symbol || "N/A";
                    break;
                  }
                }
              }
            }
            else {
              assetSymbol = instruction.parsed.info?.mint ? instruction.parsed.info.mint.slice(0, 6) : "SPL";
            }
            foundValidInstruction = true;
          }

          if (foundValidInstruction) break;
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
              ? "Completed" : "Pending",
          date: new Date(blockTimeSec * 1000).toISOString(),
          address,
        });
      }

      console.log(`Final transaction list length: ${txList.length}`);

      const sortedTxList = txList.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      const finalList = limit !== null ? sortedTxList.slice(0, limit) : sortedTxList;
      setTransactions(finalList);
    }
    catch (e) {
      console.error("Error fetching transactions:", e);
      setError(e instanceof Error ? e : new Error("An unknown error occurred"));
    }
    finally {
      setIsLoading(false);
    }
  }, [publicKey, limit]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return { transactions, isLoading, error, refetch: fetchTransactions };
}
