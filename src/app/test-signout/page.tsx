"use client";

import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function TestSignOutPage() {
  const { logout, isAuthenticated, email } = useAdminAuth();
  const router = useRouter();

  const handleTestSignOut = async () => {
    try {
      logout();
      toast.success("Sign out successful!");
      setTimeout(() => {
        router.push("/auth");
      }, 1000);
    } catch (error) {
      toast.error("Sign out failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">Sign Out Test Page</h1>

        <div className="space-y-6">
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">
              Authentication Status
            </h2>
            <div className="space-y-2">
              <p>
                <strong>Authenticated:</strong> {isAuthenticated ? "Yes" : "No"}
              </p>
              <p>
                <strong>Email:</strong> {email || "Not logged in"}
              </p>
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Test Sign Out</h2>
            <button
              onClick={handleTestSignOut}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
            >
              Test Sign Out
            </button>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Instructions</h2>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>Make sure you're logged in to the admin dashboard</li>
              <li>Click "Test Sign Out" to test the logout functionality</li>
              <li>You should see a success toast and be redirected to /auth</li>
              <li>
                Try accessing /admin again - you should be redirected to /auth
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
