"use client"

import { Building, Coins, CreditCard, Gem, Plus } from "lucide-react"

const portfolioAssets = [
  {
    id: 1,
    type: "Vàng SJC",
    icon: Coins,
    currentValue: "1,250,000,000 VNĐ",
    tokens: "1,250 GOLD",
    issueDate: "2024-01-15",
    change: "+2.5%",
    positive: true
  },
  {
    id: 2,
    type: "Căn hộ Vinhomes",
    icon: Building,
    currentValue: "2,500,000,000 VNĐ",
    tokens: "2,500 REAL",
    issueDate: "2024-02-20",
    change: "+1.8%",
    positive: true
  },
  {
    id: 3,
    type: "Kim cương",
    icon: Gem,
    currentValue: "500,000,000 VNĐ",
    tokens: "500 DIAM",
    issueDate: "2024-03-10",
    change: "-0.5%",
    positive: false
  },
  {
    id: 4,
    type: "Trái phiếu chính phủ",
    icon: CreditCard,
    currentValue: "1,000,000,000 VNĐ",
    tokens: "1,000 BOND",
    issueDate: "2024-01-05",
    change: "+0.8%",
    positive: true
  }
]

export default function PortfolioPage() {
  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <h2 className='text-2xl font-bold text-white'>Danh mục tài sản</h2>
        <button
          className='glass-card px-4 py-2 hover:bg-white/5 transition-colors'
          style={{ color: "oklch(0.65 0.18 260)" }}
        >
          <Plus className='w-4 h-4 inline mr-2' />
          Thêm tài sản
        </button>
      </div>

      <div className='glass-card overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead className='border-b border-white/10'>
              <tr>
                <th
                  className='text-left p-4 font-medium'
                  style={{ color: "oklch(0.65 0.18 260 / 0.8)" }}
                >
                  Tài sản
                </th>
                <th
                  className='text-left p-4 font-medium'
                  style={{ color: "oklch(0.65 0.18 260 / 0.8)" }}
                >
                  Giá trị hiện tại
                </th>
                <th
                  className='text-left p-4 font-medium'
                  style={{ color: "oklch(0.65 0.18 260 / 0.8)" }}
                >
                  Token
                </th>
                <th
                  className='text-left p-4 font-medium'
                  style={{ color: "oklch(0.65 0.18 260 / 0.8)" }}
                >
                  Ngày phát hành
                </th>
                <th
                  className='text-left p-4 font-medium'
                  style={{ color: "oklch(0.65 0.18 260 / 0.8)" }}
                >
                  Thay đổi
                </th>
              </tr>
            </thead>
            <tbody>
              {portfolioAssets.map((asset) => {
                const IconComponent = asset.icon
                return (
                  <tr
                    key={asset.id}
                    className='border-b border-white/5 hover:bg-white/5 transition-colors'
                  >
                    <td className='p-4'>
                      <div className='flex items-center'>
                        <div className='glass-card p-2 mr-3'>
                          <IconComponent
                            className='w-5 h-5'
                            style={{ color: "oklch(0.65 0.18 260)" }}
                          />
                        </div>
                        <span className='text-white font-medium'>
                          {asset.type}
                        </span>
                      </div>
                    </td>
                    <td className='p-4 text-white'>{asset.currentValue}</td>
                    <td
                      className='p-4'
                      style={{ color: "oklch(0.65 0.18 260 / 0.8)" }}
                    >
                      {asset.tokens}
                    </td>
                    <td
                      className='p-4'
                      style={{ color: "oklch(0.65 0.18 260 / 0.8)" }}
                    >
                      {asset.issueDate}
                    </td>
                    <td className='p-4'>
                      <span
                        className={
                          asset.positive ? "text-green-400" : "text-red-400"
                        }
                      >
                        {asset.change}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
