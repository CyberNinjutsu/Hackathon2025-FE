"use client"

import { TrendingUp, DollarSign, Coins } from "lucide-react"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip
} from "recharts"

const assetData = [
  { name: "Vàng", value: 45, color: "#FFD700" },
  { name: "Bất động sản", value: 35, color: "#8B4513" },
  { name: "Trái phiếu", value: 15, color: "#4169E1" },
  { name: "Cổ phiếu", value: 5, color: "#32CD32" }
]

const priceData = [
  { month: "T1", value: 850000 },
  { month: "T2", value: 920000 },
  { month: "T3", value: 880000 },
  { month: "T4", value: 950000 },
  { month: "T5", value: 1020000 },
  { month: "T6", value: 1150000 }
]

export default function Dashboard() {
  return (
    <div className='space-y-6'>
      {/* Tổng giá trị tài sản */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6'>
        <div className='glass-card p-4 lg:p-6'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm' style={{ color: "oklch(0.65 0.18 260)" }}>
                Tổng giá trị VNĐ
              </p>
              <p className='text-xl lg:text-2xl font-bold text-white'>
                ₫1,570,000,000
              </p>
            </div>
            <DollarSign
              className='h-6 w-6 lg:h-8 lg:w-8'
              style={{ color: "oklch(0.65 0.18 260)" }}
            />
          </div>
          <div className='flex items-center mt-2'>
            <TrendingUp className='h-4 w-4 text-green-400 mr-1' />
            <span className='text-sm text-green-400'>+8.2%</span>
          </div>
        </div>

        <div className='glass-card p-4 lg:p-6'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm' style={{ color: "oklch(0.65 0.18 260)" }}>
                Tổng giá trị USD
              </p>
              <p className='text-xl lg:text-2xl font-bold text-white'>
                $63,200
              </p>
            </div>
            <DollarSign
              className='h-6 w-6 lg:h-8 lg:w-8'
              style={{ color: "oklch(0.65 0.18 260)" }}
            />
          </div>
          <div className='flex items-center mt-2'>
            <TrendingUp className='h-4 w-4 text-green-400 mr-1' />
            <span className='text-sm text-green-400'>+6.8%</span>
          </div>
        </div>

        <div className='glass-card p-4 lg:p-6'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm' style={{ color: "oklch(0.65 0.18 260)" }}>
                Tổng Token
              </p>
              <p className='text-xl lg:text-2xl font-bold text-white'>1,570</p>
            </div>
            <Coins
              className='h-6 w-6 lg:h-8 lg:w-8'
              style={{ color: "oklch(0.65 0.18 260)" }}
            />
          </div>
          <div className='flex items-center mt-2'>
            <TrendingUp className='h-4 w-4 text-green-400 mr-1' />
            <span className='text-sm text-green-400'>+12 token</span>
          </div>
        </div>
      </div>

      {/* Biểu đồ */}
      <div className='grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6'>
        <div className='glass-card p-4 lg:p-6'>
          <h3 className='text-lg font-semibold text-white mb-4'>
            Phân bổ tài sản
          </h3>
          <div className='h-64'>
            <ResponsiveContainer width='100%' height='100%'>
              <PieChart>
                <Pie
                  data={assetData}
                  cx='50%'
                  cy='50%'
                  outerRadius={80}
                  fill='#8884d8'
                  dataKey='value'
                  label={({ name, percent }) =>
                    `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                  }
                >
                  {assetData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "oklch(0.12 0.015 240)",
                    border: "1px solid oklch(0.2 0.02 240)",
                    borderRadius: "8px",
                    color: "white"
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className='grid grid-cols-2 gap-2 mt-4'>
            {assetData.map((item, index) => (
              <div key={index} className='flex items-center'>
                <div
                  className='w-3 h-3 rounded-full mr-2'
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className='text-sm text-white'>
                  {item.name}: {item.value}%
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className='glass-card p-4 lg:p-6'>
          <h3 className='text-lg font-semibold text-white mb-4'>
            Biến động giá trị
          </h3>
          <div className='h-64'>
            <ResponsiveContainer width='100%' height='100%'>
              <LineChart data={priceData}>
                <XAxis dataKey='month' stroke='oklch(0.65 0.18 260)' />
                <YAxis stroke='oklch(0.65 0.18 260)' />
                <Tooltip />
                <Line
                  type='monotone'
                  dataKey='value'
                  stroke='oklch(0.65 0.18 260)'
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
