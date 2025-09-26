import { Connection, PublicKey } from "@solana/web3.js";

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
        limit: 100, // Use the maximum limit for efficiency
        before: lastSignature,
      }
    );

    transactionCount += signaturesBatch.length;

    // Stop fetching if the last batch was smaller than the limit
    if (signaturesBatch.length < 100) {
      keepFetching = false;
    } else {
      // Get the last signature to use as the 'before' cursor for the next request
      lastSignature = signaturesBatch[signaturesBatch.length - 1].signature;
    }
  }
  return transactionCount;
}
export async function fetchTotalTransactions(
  publicKeys: string[]
): Promise<Map<string, number | "error">> {
    const url = "https://api.devnet.solana.com";

  const connection = new Connection(url, "confirmed");
  const resultsMap = new Map<string, number | "error">();

  const promises = publicKeys.map((pk) =>
    getSignatureCountForAddress(pk, connection)
  );

  const results = await Promise.allSettled(promises);

  results.forEach((result, index) => {
    const publicKey = publicKeys[index];
    if (result.status === "fulfilled") {
      resultsMap.set(publicKey, result.value);
    } else {
      console.error(
        `Error fetching total transactions for ${publicKey}:`,
        result.reason
      );
      resultsMap.set(publicKey, "error");
    }
  });

  return resultsMap;
}
