"use client";

import type React from "react";
import { useState } from "react";
import Link from "next/link";
import {
  Connection,
  PublicKey,
  clusterApiUrl,
  Transaction,
} from "@solana/web3.js";
import { Shield, Wallet, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"; // 1. Import Tabs
import { useRouter } from "next/navigation";
import Image from "next/image";
import bg from "@/assets/gold-gemstone.png";
import icon from "@/assets/iconheader.png";
import { useAuth } from "@/lib/AuthContext"; // Giả định AuthContext của bạn ở đây
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
  const { login } = useAuth();
  const [publicKeyInput, setPublicKeyInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateAndLogin = async (publicKeyString: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
      const key = new PublicKey(publicKeyString);
      const accountInfo = await connection.getAccountInfo(key);

      if (accountInfo === null) {
        throw new Error("Địa chỉ ví Solana này không tồn tại trên blockchain.");
      }

      login(publicKeyString);
      toast.success("Kết nối thành công!", {
        description: "Bạn sẽ được chuyển hướng sau giây lát...",
      });
      setTimeout(() => router.push("/"), 2000);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Đã xảy ra lỗi không xác định.";
      setError("Xác thực ví thất bại: " + errorMessage);
      toast.error("Xác thực thất bại", { description: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitManual = async (e: React.FormEvent) => {
    e.preventDefault();
    await validateAndLogin(publicKeyInput);
  };

  const validateAndProceed = (publicKeyString: string) => {
    login(publicKeyString);
    toast.success("Xác thực thành công!", {
      description: "Bạn sẽ được chuyển hướng sau giây lát...",
    });
    setTimeout(() => router.push("/"), 2000);
  };
  const handleConnectAndSign = async () => {
    if (!window.solana || !window.solana.isPhantom) {
      toast.error("Ví Phantom chưa được cài đặt!", {
        description: "Vui lòng cài đặt extension Phantom và thử lại.",
      });
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const resp = await window.solana.connect();
      const userPublicKey = resp.publicKey;

      const nonce = `Đăng nhập vào MysticalGold lúc: ${new Date().toISOString()}`;
      const message = new TextEncoder().encode(nonce);

      const signedMessage = await window.solana.signMessage(message, "utf8");

      const isVerified = nacl.sign.detached.verify(
        message,
        signedMessage.signature,
        userPublicKey.toBytes()
      );

      if (!isVerified) {
        throw new Error("Xác thực chữ ký thất bại. Vui lòng thử lại.");
      }

      const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
      const accountInfo = await connection.getAccountInfo(userPublicKey);
      if (accountInfo === null) {
        throw new Error(
          "Ví đã được xác thực nhưng chưa được khởi tạo trên blockchain."
        );
      }

      validateAndProceed(userPublicKey.toString());
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Người dùng đã từ chối yêu cầu.";
      setError(msg);
      toast.error("Kết nối hoặc xác thực thất bại", { description: msg });
    } finally {
      setIsLoading(false);
    }
  };
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
          Trang chủ
        </Link>
      </Button>
      <Image
        src={bg}
        alt="Blockchain background"
        fill
        className="object-cover object-center opacity-70"
        priority
        quality={85}
        placeholder="blur"
      />

      <div className="w-full max-w-md space-y-6 sm:space-y-8 relative z-10">
        <div className="text-center space-y-4 floating">
          <div className="flex justify-center">
            <div className="glass-logo flex h-16 w-16 items-center justify-center rounded-2xl">
              <Image src={icon} alt="Logo" className="object-cover" />
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-balance glass-text-warning">
              Truy cập an toàn
            </h1>
            <p className="glass-text-secondary text-pretty">
              Truy cập an toàn vào tài sản blockchain của bạn
            </p>
          </div>
        </div>

        <Tabs defaultValue="manual" className="w-full">
          <TabsList className="grid w-full grid-cols-2 glass-card border-0">
            <TabsTrigger value="manual">Nhập thủ công</TabsTrigger>
            <TabsTrigger value="wallet">Kết nối ví</TabsTrigger>
          </TabsList>

          <TabsContent value="manual">
            <Card className="glass-card border-0">
              <CardHeader className="space-y-1 text-center pb-4">
                <CardTitle className="text-xl sm:text-2xl font-semibold glass-text-primary">
                  Truy cập bằng địa chỉ
                </CardTitle>
                <CardDescription className="glass-text-secondary">
                  Nhập địa chỉ ví Solana của bạn để tiếp tục
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitManual} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="publicKey" className="glass-text-primary">
                      Địa chỉ ví Solana
                    </Label>
                    <div className="relative">
                      <Wallet className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/70" />
                      <Input
                        id="publicKey"
                        type="text"
                        placeholder="Ví dụ: 5x2e...8sHn"
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
                        Đang kiểm tra...
                      </>
                    ) : (
                      "Truy cập Ví"
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
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="wallet">
            <Card className="glass-card border-0">
              <CardHeader className="space-y-1 text-center pb-4">
                <CardTitle className="text-xl sm:text-2xl font-semibold glass-text-primary">
                  Kết nối Phantom
                </CardTitle>
                <CardDescription className="glass-text-secondary">
                  Kết nối an toàn với ví Phantom của bạn.
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
                      Đang xử lý...
                    </>
                  ) : (
                    "Kết nối và Ký với Phantom"
                  )}
                </Button>
                <div className="mt-6 flex items-start space-x-2 glass-notice rounded-lg p-3 w-full">
                  <Shield className="h-4 w-4 text-white mt-0.5 flex-shrink-0" />
                  <div className="text-xs">
                    <p className="font-medium glass-text-primary">
                      Kiểm tra ở chế độ chỉ đọc
                    </p>
                    <p className="glass-text-muted">
                      Chúng tôi chỉ kiểm tra sự tồn tại của ví và không thực
                      hiện bất kỳ giao dịch nào.
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
