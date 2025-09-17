"use client";

import Link from "next/link";
import { ArrowLeft, Coins } from "lucide-react";
import { useRouter } from "next/navigation";

export default function TermsPage() {
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
        {/* Content Card */}
        <div className="bg-gradient-to-r from-gray-900/80 to-black/80 backdrop-blur-xl border border-gray-800 rounded-xl shadow-2xl">
          {/* Header */}
          <div className="p-6 border-b border-gray-700/50 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-cyan-400 bg-clip-text text-transparent">
              Terms of Service
            </h2>
            <p className="text-gray-400 text-sm">Last updated: May 21, 2024</p>
          </div>

          {/* Content */}
          <div className="p-6 prose prose-invert max-w-none">
            <div className="space-y-6 text-gray-300 leading-relaxed">
              <p>
                Welcome to Cryptix! Please read these Terms of Service
                (&ldquo;Terms&rdquo;) carefully before using our service. By
                accessing or using the Service, you agree to be bound by these
                Terms.
              </p>

              <h2 className="text-xl font-semibold text-primary mt-8 mb-4 border-b border-primary/30 pb-2">
                1. Acceptance of Terms
              </h2>
              <p>
                By creating an account or using the services provided by
                Cryptix, you acknowledge that you have read, understood, and
                agree to comply with all terms and conditions set forth in this
                agreement.
              </p>

              <h2 className="text-xl font-semibold text-primary mt-8 mb-4 border-b border-primary/30 pb-2">
                2. Service Description
              </h2>
              <p>
                Cryptix provides a digital asset management platform that allows
                users to track investment portfolios, execute transactions, and
                interact with blockchain protocols. We are not an exchange,
                broker, or financial advisor.
              </p>

              <h2 className="text-xl font-semibold text-primary mt-8 mb-4 border-b border-primary/30 pb-2">
                3. User Responsibilities
              </h2>
              <p>You are responsible for:</p>
              <ul className="list-disc list-inside space-y-2 mb-4 pl-4 text-gray-300">
                <li>
                  Securing login information, private keys, and other
                  authentication information.
                </li>
                <li>
                  Ensuring that all information you provide is accurate and
                  up-to-date.
                </li>
                <li>
                  Complying with all applicable laws and regulations in your
                  jurisdiction.
                </li>
              </ul>

              <h2 className="text-xl font-semibold text-primary mt-8 mb-4 border-b border-primary/30 pb-2">
                4. Limitation of Liability
              </h2>
              <p>
                The Service is provided &quot;as is&quot; and &quot;as
                available&quot;. Cryptix is not responsible for any losses
                arising from the use of the service, including but not limited
                to asset loss due to security errors, software bugs, or market
                volatility.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
