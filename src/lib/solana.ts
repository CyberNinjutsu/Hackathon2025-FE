import {
  Connection,
  PublicKey,
  ParsedTransactionWithMeta,
  clusterApiUrl,
} from "@solana/web3.js";

export interface SolanaTransaction {
  signature: string;
  slot: number;
  blockTime: number | null;
  fee: number;
  status: "success" | "failed";
  type: string;
  amount?: number;
  from?: string;
  to?: string;
  programId?: string;
}
async function getSignatureCountForAddress(
  publicKey: string,
  connection: Connection
): Promise<number> {
  const walletPubKey = new PublicKey(publicKey);
  let transactionCount = 0;
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
    transactionCount += signaturesBatch.length;
    if (signaturesBatch.length < 1000) {
      keepFetching = false;
    } else {
      lastSignature = signaturesBatch[signaturesBatch.length - 1].signature;
    }
  }
  return transactionCount;
}
class SolanaService {
  private connection: Connection;

  private THIS_RPC_URL: string = "https://api.devnet.solana.com";

  private readonly WALLET_ADDRESSES = [
    "Gy2LZ5EEvuZFGDHbak6kmS7EgUhtAtKCDLA4siZDEcwE",
    "BbyQ1KPKYx8NRvkW7Yymio44R2CmGAuZaeWSNscwDuvh",
  ];

  constructor() {
    this.connection = new Connection(this.THIS_RPC_URL, "confirmed");
  }
  public async getTotalTransactionsForWallets(
    publicKeys: string[] = this.WALLET_ADDRESSES
  ): Promise<Map<string, number | "error">> {
    const resultsMap = new Map<string, number | "error">();

    const promises = publicKeys.map((pk) =>
      this.getSignatureCountForAddress(pk)
    );

    const results = await Promise.allSettled(promises);

    results.forEach((result, index) => {
      const publicKey = publicKeys[index];
      if (result.status === "fulfilled") {
        resultsMap.set(publicKey, result.value);
      } else {
        console.error(
          `Error fetching total transaction count for ${publicKey}:`,
          result.reason
        );
        resultsMap.set(publicKey, "error");
      }
    });

    return resultsMap;
  }

  /**
   * Private helper to fetch the total signature count for a single address.
   */
  private async getSignatureCountForAddress(
    publicKey: string
  ): Promise<number> {
    const walletPubKey = new PublicKey(publicKey);
    let transactionCount = 0;
    let lastSignature: string | undefined = undefined;
    let keepFetching = true;

    while (keepFetching) {
      const signaturesBatch = await this.connection.getSignaturesForAddress(
        walletPubKey,
        {
          limit: 1000, // Use max limit for efficiency
          before: lastSignature,
        }
      );
      transactionCount += signaturesBatch.length;
      if (signaturesBatch.length < 1000) {
        keepFetching = false;
      } else {
        lastSignature = signaturesBatch[signaturesBatch.length - 1].signature;
      }
    }
    return transactionCount;
  }


  async getRecentTransactions(
    limit: number = 100
  ): Promise<SolanaTransaction[]> {
    try {
      const transactions: SolanaTransaction[] = [];

      for (const address of this.WALLET_ADDRESSES) {
        const pubkey = new PublicKey(address);
        // Lấy nhiều giao dịch hơn cho mỗi ví
        const signatures = await this.connection.getSignaturesForAddress(
          pubkey,
          { limit: 50 } // Lấy 50 giao dịch gần nhất cho mỗi ví
        );

        // console.log(`Fetching ${signatures.length} transactions for wallet: ${address}`);

        for (const sig of signatures) {
          try {
            const tx = await this.connection.getParsedTransaction(
              sig.signature,
              { maxSupportedTransactionVersion: 0 }
            );

            if (tx) {
              transactions.push(this.parseTransaction(tx, sig.signature));
            }
          } catch (txError) {
            console.warn(
              `Failed to fetch transaction ${sig.signature}:`,
              txError
            );
          }
        }
      }

      // console.log(`Total transactions fetched: ${transactions.length}`);

      return transactions
        .sort((a, b) => (b.blockTime || 0) - (a.blockTime || 0))
        .slice(0, limit);
    } catch (error) {
      console.error("Error fetching Solana transactions:", error);
      return this.getMockTransactions();
    }
  }

  private parseTransaction(
    tx: ParsedTransactionWithMeta,
    signature: string
  ): SolanaTransaction {
    const meta = tx.meta;
    const message = tx.transaction.message;

    return {
      signature,
      slot: tx.slot,
      blockTime: tx.blockTime || null,
      fee: meta?.fee || 0,
      status: meta?.err ? "failed" : "success",
      type: this.getTransactionType(message),
      amount: this.getTransactionAmount(meta),
      from: message.accountKeys[0]?.pubkey.toString(),
      to: message.accountKeys[1]?.pubkey.toString(),
      programId: message.instructions[0]?.programId.toString(),
    };
  }

  private getTransactionType(message: {
    instructions: Array<{ programId: { toString(): string } }>;
  }): string {
    const programIds = message.instructions.map((ix) =>
      ix.programId.toString()
    );

    if (programIds.includes("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA")) {
      return "token-transfer";
    }
    if (programIds.includes("11111111111111111111111111111111")) {
      return "sol-transfer";
    }
    return "unknown";
  }

  private getTransactionAmount(
    meta: { preBalances?: number[]; postBalances?: number[] } | null
  ): number {
    if (!meta?.preBalances || !meta?.postBalances) return 0;

    const balanceChange = Math.abs(
      (meta.postBalances[0] || 0) - (meta.preBalances[0] || 0)
    );

    return balanceChange / 1e9; // Convert lamports to SOL
  }

  private getMockTransactions(): SolanaTransaction[] {
    const now = Date.now() / 1000;
    return [
      {
        signature:
          "5VfYmGBjvxKjKvGdNMVHyd2pHkp2BjBNsU4hkaNNyQuDqbwsuUsb2gkSE2qiQQ6FEjNb7Ex3BvpJbvJ8wVjHEqLs",
        slot: 234567890,
        blockTime: now - 300,
        fee: 5000,
        status: "success" as const,
        type: "token-transfer",
        amount: 1.5,
        from: "Gy2LZ5EEvuZFGDHbak6kmS7EgUhtAtKCDLA4siZDEcwE",
        to: "BbyQ1KPKYx8NRvkW7Yymio44R2CmGAuZaeWSNscwDuvh",
      },
      {
        signature:
          "3NZ9JMVBmhWPyqXw8AiUh3JvGpMj1eiWN9C4KQpJ1VGhVb2rJhKGF4Np8Xw2Yv5Z1Qm7Rt6Sw9Uv3Xz8Cb1Df2",
        slot: 234567889,
        blockTime: now - 600,
        fee: 5000,
        status: "success" as const,
        type: "sol-transfer",
        amount: 0.8,
        from: "BbyQ1KPKYx8NRvkW7Yymio44R2CmGAuZaeWSNscwDuvh",
        to: "Gy2LZ5EEvuZFGDHbak6kmS7EgUhtAtKCDLA4siZDEcwE",
      },
      {
        signature:
          "2Kx8JMVBmhWPyqXw8AiUh3JvGpMj1eiWN9C4KQpJ1VGhVb2rJhKGF4Np8Xw2Yv5Z1Qm7Rt6Sw9Uv3Xz8Cb1Df3",
        slot: 234567888,
        blockTime: now - 900,
        fee: 5000,
        status: "failed" as const,
        type: "token-transfer",
        amount: 2.1,
        from: "Gy2LZ5EEvuZFGDHbak6kmS7EgUhtAtKCDLA4siZDEcwE",
        to: "BbyQ1KPKYx8NRvkW7Yymio44R2CmGAuZaeWSNscwDuvh",
      },
      {
        signature:
          "4Lx9KNVCniXQzrYx9BiVi4KwHqNk2fjXO8D5LrK2WIiWc3sKiLHG5Op9Yx3Zw6A2Rn8Su7Tx0Vw4Yz9Dc2Eg4",
        slot: 234567887,
        blockTime: now - 1200,
        fee: 5000,
        status: "success" as const,
        type: "sol-transfer",
        amount: 0.3,
        from: "BbyQ1KPKYx8NRvkW7Yymio44R2CmGAuZaeWSNscwDuvh",
        to: "Gy2LZ5EEvuZFGDHbak6kmS7EgUhtAtKCDLA4siZDEcwE",
      },
      {
        signature:
          "6Mx0LPWDojYRzsZy0CjWj5LxIrOl3gkYP9E6MsL3XJjXd4tLjMIH6Pq0Zy4Ax7B3So9Tv8Uy1Wx5Za0Ed3Fh5",
        slot: 234567886,
        blockTime: now - 1500,
        fee: 5000,
        status: "success" as const,
        type: "token-transfer",
        amount: 5.2,
        from: "Gy2LZ5EEvuZFGDHbak6kmS7EgUhtAtKCDLA4siZDEcwE",
        to: "BbyQ1KPKYx8NRvkW7Yymio44R2CmGAuZaeWSNscwDuvh",
      },
    ];
  }
}

export const solanaService = new SolanaService();
