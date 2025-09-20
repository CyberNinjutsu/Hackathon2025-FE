import { Building, Coins, Plus, RefreshCw, ShoppingCart } from "lucide-react";
import React from "react";

export default function page() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Hành động quản lý</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Tokenize New Asset */}
        <div className="glass-card p-6 hover:bg-white/5 transition-colors cursor-pointer">
          <div className="text-center">
            <div className="glass-card p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Plus
                className="w-8 h-8"
                style={{ color: "oklch(0.65 0.18 260)" }}
              />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Tokenize tài sản mới
            </h3>
            <p
              className="text-sm mb-4"
              style={{ color: "oklch(0.65 0.18 260 / 0.7)" }}
            >
              Chuyển đổi vàng, bất động sản hoặc tài sản khác thành token
            </p>
            <button
              className="w-full glass-card px-4 py-2 hover:bg-white/5 transition-colors"
              style={{ color: "oklch(0.65 0.18 260)" }}
            >
              Bắt đầu
            </button>
          </div>
        </div>

        {/* Sell on Marketplace */}
        <div className="glass-card p-6 hover:bg-white/5 transition-colors cursor-pointer">
          <div className="text-center">
            <div className="glass-card p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <ShoppingCart
                className="w-8 h-8"
                style={{ color: "oklch(0.65 0.18 260)" }}
              />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Bán trên Marketplace
            </h3>
            <p
              className="text-sm mb-4"
              style={{ color: "oklch(0.65 0.18 260 / 0.7)" }}
            >
              Đưa token của bạn lên sàn giao dịch để bán cho người khác
            </p>
            <button
              className="w-full glass-card px-4 py-2 hover:bg-white/5 transition-colors"
              style={{ color: "oklch(0.65 0.18 260)" }}
            >
              Đăng bán
            </button>
          </div>
        </div>

        {/* Redeem Assets */}
        <div className="glass-card p-6 hover:bg-white/5 transition-colors cursor-pointer">
          <div className="text-center">
            <div className="glass-card p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <RefreshCw className="w-8 h-8 text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Rút giá trị (Redeem)
            </h3>
            <p
              className="text-sm mb-4"
              style={{ color: "oklch(0.65 0.18 260 / 0.7)" }}
            >
              Chuyển đổi token về tài sản thật hoặc tiền mặt
            </p>
            <button className="w-full glass-card px-4 py-2 text-green-400 hover:text-green-300 transition-colors">
              Redeem
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          Thao tác nhanh
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="glass-card p-4 text-left hover:bg-white/5 transition-colors">
            <div className="flex items-center">
              <Coins className="w-6 h-6 text-yellow-400 mr-3" />
              <div>
                <p className="text-white font-medium">Tokenize vàng</p>
                <p
                  className="text-sm"
                  style={{ color: "oklch(0.65 0.18 260 / 0.7)" }}
                >
                  Chuyển đổi vàng thành GOLD token
                </p>
              </div>
            </div>
          </button>

          <button className="glass-card p-4 text-left hover:bg-white/5 transition-colors">
            <div className="flex items-center">
              <Building
                className="w-6 h-6 mr-3"
                style={{ color: "oklch(0.65 0.18 260)" }}
              />
              <div>
                <p className="text-white font-medium">Tokenize bất động sản</p>
                <p
                  className="text-sm"
                  style={{ color: "oklch(0.65 0.18 260 / 0.7)" }}
                >
                  Chuyển đổi BĐS thành REAL token
                </p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
