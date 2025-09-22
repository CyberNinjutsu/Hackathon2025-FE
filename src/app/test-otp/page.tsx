"use client";

import { useState } from "react";

export default function TestOTPPage() {
  const [email, setEmail] = useState("buichibao1601@gmail.com");
  const [otp, setOtp] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testSendOTP = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      setResult({ type: "send", data, status: response.status });
    } catch (error) {
      setResult({ type: "send", error: error.message });
    }
    setLoading(false);
  };

  const testVerifyOTP = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await response.json();
      setResult({ type: "verify", data, status: response.status });
    } catch (error) {
      setResult({ type: "verify", error: error.message });
    }
    setLoading(false);
  };

  const testAuthStatus = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/test-auth");
      const data = await response.json();
      setResult({ type: "status", data, status: response.status });
    } catch (error) {
      setResult({ type: "status", error: error.message });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">OTP Testing Page</h1>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">OTP Code:</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter 6-digit OTP"
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
            />
          </div>

          <div className="flex gap-4">
            <button
              onClick={testSendOTP}
              disabled={loading}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg disabled:opacity-50"
            >
              Send OTP
            </button>

            <button
              onClick={testVerifyOTP}
              disabled={loading}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg disabled:opacity-50"
            >
              Verify OTP
            </button>

            <button
              onClick={testAuthStatus}
              disabled={loading}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg disabled:opacity-50"
            >
              Check Status
            </button>
          </div>

          {result && (
            <div className="mt-8 p-4 bg-gray-800 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">
                Result ({result.type}):
              </h3>
              <pre className="text-sm overflow-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}

          <div className="mt-8 p-4 bg-gray-800 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Instructions:</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>Click "Send OTP" to generate and send an OTP code</li>
              <li>
                Check the browser console for the OTP code (development mode)
              </li>
              <li>Enter the OTP code in the input field</li>
              <li>Click "Verify OTP" to test verification</li>
              <li>Use "Check Status" to see OTP storage debug info</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
