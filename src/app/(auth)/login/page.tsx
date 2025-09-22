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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/lib/AuthContext";
import {
  clusterApiUrl,
  Connection,
  PublicKey,
  Transaction,
} from "@solana/web3.js";
import { ArrowLeft, Shield, Wallet } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
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

declare global {
  interface Window {
    solana?: SolanaProvider;
  }
}

export default function LoginPage() {
  const router = useRouter();
  const {
    savePublicKey,
    isAuthenticated,
    isLoading: isAuthLoading,
  } = useAuth();
  const [publicKeyInput, setPublicKeyInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkWalletExistence = async (publicKey: PublicKey) => {
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
    const accountInfo = await connection.getAccountInfo(publicKey);
    if (accountInfo === null) {
      throw new Error(
        "Wallet does not exist or hasn’t been initialized on-chain."
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

   const initialAuthRef = useRef(isAuthenticated);
  useEffect(() => {
    if (isAuthLoading) {
      return;
    }

    if (initialAuthRef.current && isAuthenticated) {
      toast.info("You are already logged in.", {
        description: "Redirecting to the home page...",
      });
      router.push("/");
    }
  }, [isAuthenticated, isAuthLoading, router]);
  // Manual login
  const validateAndLogin = async (publicKeyString: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const key = new PublicKey(publicKeyString);
      await checkWalletExistence(key);
      handleSuccess(publicKeyString, "Wallet connected successfully!");
    } catch (err) {
      handleError("Authentication failed", err, "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitManual = async (e: React.FormEvent) => {
    e.preventDefault();
    await validateAndLogin(publicKeyInput);
  };

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
      const resp = await window.solana.connect();
      const userPublicKey = resp.publicKey;

      const nonce = `Login to DAMS at: ${new Date().toISOString()}`;
      const message = new TextEncoder().encode(nonce);
      const signedMessage = await window.solana.signMessage(message, "utf8");

      const isVerified = nacl.sign.detached.verify(
        message,
        signedMessage.signature,
        userPublicKey.toBytes()
      );

      if (!isVerified) {
        throw new Error("Signature verification failed. Please try again.");
      }

      await checkWalletExistence(userPublicKey);
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
  if (isAuthLoading || isAuthenticated) {
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
              Safely access your blockchain assets
            </p>
          </div>
        </div>

        <Tabs defaultValue="manual" className="w-full">
          <TabsList className="grid w-full grid-cols-2 glass-card border-0">
            <TabsTrigger
              value="manual"
              className="data-[state=active]:bg-white/20 data-[state=active]:text-white data-[state=active]:font-semibold"
            >
              Enter Manually
            </TabsTrigger>
            <TabsTrigger
              value="wallet"
              className="data-[state=active]:bg-white/20 data-[state=active]:text-white data-[state=active]:font-semibold"
            >
              Connect Wallet
            </TabsTrigger>
          </TabsList>

          <TabsContent value="manual">
            <Card className="glass-card border-0">
              <CardHeader className="space-y-1 text-center pb-4">
                <CardTitle className="text-xl sm:text-2xl font-semibold glass-text-primary">
                  Access with Your Public Address
                </CardTitle>
                <CardDescription className="glass-text-secondary">
                  Enter your Solana wallet address to continue
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitManual} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="publicKey" className="glass-text-primary">
                      Solana Wallet Address
                    </Label>
                    <div className="relative">
                      <Wallet className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/70" />
                      <Input
                        id="publicKey"
                        type="text"
                        placeholder="Example: 5x2e...8sHn"
                        value={publicKeyInput}
                        onChange={(e) => setPublicKeyInput(e.target.value)}
                        className="text-white/80 glass-input pl-10 border-0 no-autofill-bg"
                        required
                        name="publicKey"
                      />
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="border-0 w-full glass-button text-white"
                    size="lg"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                        Checking...
                      </>
                    ) : (
                      "Access Wallet"
                    )}
                  </Button>
                  {error && (
                    <p
                      className="text-sm text-red-300 text-center"
                      role="alert"
                    >
                      {error}
                    </p>
                  )}
                </form>
                <Link href="/register">
                  <p className="text-white text-center mt-2">
                    Don’t have a wallet yet?
                  </p>
                </Link>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="wallet">
            <Card className="glass-card border-0">
              <CardHeader className="space-y-1 text-center pb-4">
                <CardTitle className="text-xl sm:text-2xl font-semibold glass-text-primary">
                  Connect Phantom
                </CardTitle>
                <CardDescription className="glass-text-secondary">
                  Securely connect with your Phantom wallet.
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
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
