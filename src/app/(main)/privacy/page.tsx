"use client";

import Link from "next/link";
import { ArrowLeft, Coins } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PrivacyPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white custom-scrollbar">
      {/* Background glow effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-20 left-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-cyan-400/10 rounded-full blur-3xl"></div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-20 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-6">
            <div className="w-16 h-16 bg-primary/20 border border-primary/30 rounded-2xl flex items-center justify-center mx-auto transition-all duration-300 hover:scale-105">
              <Coins className="h-8 w-8 text-primary" />
            </div>
          </Link>
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-cyan-400 bg-clip-text text-transparent">
              Cryptix
            </h1>
          </div>
        </div>
        {/* Content Card */}
        <div className="bg-gradient-to-r from-gray-900/80 to-black/80 backdrop-blur-xl border border-gray-800 rounded-xl shadow-2xl">
          {/* Header */}
          <div className="p-6 border-b border-gray-700/50 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-cyan-400 bg-clip-text text-transparent">
              Privacy Policy
            </h2>
            <p className="text-gray-400 text-sm">Last updated: May 21, 2025</p>
          </div>

          {/* Content */}
          <div className="p-6 prose prose-invert max-w-none">
            <div className="space-y-6 text-gray-300 leading-relaxed">
              <p>
                This Privacy Policy describes how Cryptix collects, uses, and
                shares your personal information when you use our services. We
                are committed to protecting your privacy.
              </p>

              <h2 className="text-xl font-semibold text-primary mt-8 mb-4 border-b border-primary/30 pb-2">
                1. Information We Collect
              </h2>
              <p>We may collect the following types of information:</p>
              <ul className="list-disc list-inside space-y-2 mb-4 pl-4 text-gray-300">
                <li>
                  <strong className="text-white font-semibold">
                    Personal Information:
                  </strong>{" "}
                  Name, email address when you register for an account.
                </li>
                <li>
                  <strong className="text-white font-semibold">
                    Transaction Information:
                  </strong>{" "}
                  Public wallet addresses, transaction history. We never collect
                  your private keys.
                </li>
                <li>
                  <strong className="text-white font-semibold">
                    Usage Information:
                  </strong>{" "}
                  Data about how you interact with our services, such as IP
                  address, browser type, access times.
                </li>
              </ul>

              <h2 className="text-xl font-semibold text-primary mt-8 mb-4 border-b border-primary/30 pb-2">
                2. How We Use Information
              </h2>
              <p>Your information is used to:</p>
              <ul className="list-disc list-inside space-y-2 mb-4 pl-4 text-gray-300">
                <li>Provide and maintain the service.</li>
                <li>Improve and personalize user experience.</li>
                <li>
                  Communicate with you, including sending security
                  notifications.
                </li>
                <li>Prevent fraud and ensure platform security.</li>
              </ul>

              <h2 className="text-xl font-semibold text-primary mt-8 mb-4 border-b border-primary/30 pb-2">
                3. Information Sharing
              </h2>
              <p>
                We do not sell, trade, or rent your personal information to
                third parties. We may only share information when legally
                required or to protect our rights and the community.
              </p>

              <h2 className="text-xl font-semibold text-primary mt-8 mb-4 border-b border-primary/30 pb-2">
                4. Data Security
              </h2>
              <p>
                We implement industry-standard security measures, including
                encryption and access controls, to protect your data from
                unauthorized access, modification, or destruction.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
