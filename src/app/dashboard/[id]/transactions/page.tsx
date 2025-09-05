"use client"

const transactions = [
  {
    id: 1,
    type: "Tokenize",
    asset: "Vàng SJC 10 chỉ",
    amount: "500,000,000 VNĐ",
    tokens: "500 GOLD",
    status: "Thành công",
    date: "2024-03-15",
    statusColor: "text-green-400"
  },
  {
    id: 2,
    type: "Bán",
    asset: "REAL Token",
    amount: "100,000,000 VNĐ",
    tokens: "100 REAL",
    status: "Chờ xử lý",
    date: "2024-03-14",
    statusColor: "text-yellow-400"
  },
  {
    id: 3,
    type: "Redeem",
    asset: "BOND Token",
    amount: "200,000,000 VNĐ",
    tokens: "200 BOND",
    status: "Thất bại",
    date: "2024-03-13",
    statusColor: "text-red-400"
  }
]

interface CSSVars extends React.CSSProperties {
  "--tw-ring-color"?: string
}

export default function TransactionsPage() {
  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <h2 className='text-2xl font-bold text-white'>Lịch sử giao dịch</h2>
        <div className='flex gap-2'>
          <select
            className='glass-card px-3 py-2 text-white bg-transparent border-0 focus:ring-2'
            style={{ "--tw-ring-color": "oklch(0.65 0.18 260)" } as CSSVars}
          >
            <option value='all'>Tất cả</option>
            <option value='tokenize'>Tokenize</option>
            <option value='sell'>Bán</option>
            <option value='redeem'>Redeem</option>
          </select>
        </div>
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
                  Loại
                </th>
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
                  Giá trị
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
                  Trạng thái
                </th>
                <th
                  className='text-left p-4 font-medium'
                  style={{ color: "oklch(0.65 0.18 260 / 0.8)" }}
                >
                  Ngày
                </th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr
                  key={tx.id}
                  className='border-b border-white/5 hover:bg-white/5 transition-colors'
                >
                  <td className='p-4'>
                    <span
                      className='glass-card px-2 py-1 text-xs'
                      style={{ color: "oklch(0.65 0.18 260)" }}
                    >
                      {tx.type}
                    </span>
                  </td>
                  <td className='p-4 text-white'>{tx.asset}</td>
                  <td className='p-4 text-white'>{tx.amount}</td>
                  <td
                    className='p-4'
                    style={{ color: "oklch(0.65 0.18 260 / 0.8)" }}
                  >
                    {tx.tokens}
                  </td>
                  <td className='p-4'>
                    <span className={tx.statusColor}>{tx.status}</span>
                  </td>
                  <td
                    className='p-4'
                    style={{ color: "oklch(0.65 0.18 260 / 0.8)" }}
                  >
                    {tx.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
