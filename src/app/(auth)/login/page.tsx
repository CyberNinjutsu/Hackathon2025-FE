"use client";

import icon from "@/assets/iconheader.png";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/lib/AuthContext";
import {
  clusterApiUrl,
  Connection,
  PublicKey,
  Transaction,
} from "@solana/web3.js";
import { ArrowLeft, Shield } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import nacl from "tweetnacl";

interface SolanaProvider {
  isPhantom?: boolean;
  publicKey?: { toBytes: () => Uint8Array; toString: () => string };
  isConnected?: boolean;
  signTransaction: (transaction: Transaction) => Promise<Transaction>;
  signMessage: (
    message: Uint8Array,
    display: "utf8" | "hex"
  ) => Promise<{ signature: Uint8Array }>;
  connect: (options?: {
    onlyIfTrusted: boolean;
  }) => Promise<{ publicKey: PublicKey }>;
}



export default function LoginPage() {
  const router = useRouter();
  const {
    savePublicKey,
    isAuthenticated,
    isLoading: isAuthLoading,
  } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkWalletExistence = async (publicKey: PublicKey) => {
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
    const accountInfo = await connection.getAccountInfo(publicKey);
    if (accountInfo === null) {
      throw new Error(
        "Wallet does not exist or hasn't been initialized on-chain."
      );
    }
  };

  // Success handler
  const handleSuccess = (publicKeyString: string, message?: string) => {
    savePublicKey(publicKeyString);
    toast.success(message ?? "Authentication successful!", {
      description: "You will be redirected shortly...",
    });
    router.replace("/");
  };

  // Error handler
  const handleError = (title: string, err: unknown, fallback: string) => {
    const msg = err instanceof Error ? err.message : fallback;
    setError(msg);
    toast.error(title, { description: msg });
  };

  useEffect(() => {
    if (isAuthLoading) {
      return;
    }

    if (isAuthenticated) {
      toast.info("You are already logged in.", {
        description: "Redirecting to the home page...",
      });
      router.replace("/");
    }
  }, [isAuthenticated, isAuthLoading, router]);

  // Phantom login
  const handleConnectAndSign = async () => {
    if (!window.solana || !window.solana.isPhantom) {
      toast.error("Phantom Wallet not installed!", {
        description: "Please install the Phantom extension and try again.",
      });
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await window.solana.connect();
      const userPublicKey = window.solana.publicKey;
      if(!userPublicKey) {
        throw new Error("error");
      }
      const nonce = `Login to DAMS at: ${new Date().toISOString()}`;
      const message = new TextEncoder().encode(nonce);
      const signedMessage = await window.solana?.signMessage?.(message, "utf8");
      if (!signedMessage) {
        throw new Error('Failed to sign message');
      }

      const isVerified = nacl.sign.detached.verify(
        message,
        signedMessage.signature,
        userPublicKey.toBytes()
      );

      if (!isVerified) {
        throw new Error("Signature verification failed. Please try again.");
      }
const solanaPublicKey = new PublicKey(userPublicKey.toString());

await checkWalletExistence(solanaPublicKey);
      handleSuccess(userPublicKey.toString());
    } catch (err) {
      handleError(
        "Connection or verification failed",
        err,
        "User rejected the request."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isAuthLoading) {
    return (
      <div className="auth-background relative flex min-h-screen items-center justify-center p-4 sm:p-6 md:p-8">
        <div className="flex items-center space-x-2 text-white">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="auth-background relative flex min-h-screen items-center justify-center p-4 sm:p-6 md:p-8">
      <Button
        asChild
        variant="ghost"
        size="sm"
        className="absolute top-4 left-4 z-20 glass-card border-0 text-white hover:!bg-[rgba(0,255,178,0.07)] transition-all duration-200"
      >
        <Link href="/">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Home
        </Link>
      </Button>

      <div className="w-full max-w-md space-y-6 sm:space-y-8 relative z-10">
        <div className="text-center space-y-4 floating">
          <div className="flex justify-center">
            <div className="glass-logo flex h-16 w-16 items-center justify-center rounded-2xl">
              <Image src={icon} alt="Logo" className="object-cover" />
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-balance glass-text-warning">
              Secure Access
            </h1>
            <p className="glass-text-secondary text-pretty">
              Connect your Phantom wallet to continue
            </p>
          </div>
        </div>

        <Card className="glass-card border-0">
          <CardHeader className="space-y-1 text-center pb-4">
            <CardTitle className="text-xl sm:text-2xl font-semibold glass-text-primary">
              Connect Phantom Wallet
            </CardTitle>
            <CardDescription className="glass-text-secondary">
              Securely connect with your Phantom wallet to access your blockchain assets.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center pt-6">
            <Button
              onClick={handleConnectAndSign}
              className="border-0 w-full glass-button text-white"
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                  Processing...
                </>
              ) : (
                "Connect & Sign with Phantom"
              )}
            </Button>

            {error && (
              <p
                className="text-sm text-red-300 text-center mt-4"
                role="alert"
              >
                {error}
              </p>
            )}

            <div className="mt-6 flex items-start space-x-2 glass-notice rounded-lg p-3 w-full">
              <Shield className="h-4 w-4 text-white mt-0.5 flex-shrink-0" />
              <div className="text-xs">
                <p className="font-medium glass-text-primary">
                  Read-only check
                </p>
                <p className="glass-text-muted">
                  We only check for wallet existence and do not perform any
                  transactions.
                </p>
              </div>
            </div>

          </CardContent>
        </Card>
      </div>
    </div>
  );
}