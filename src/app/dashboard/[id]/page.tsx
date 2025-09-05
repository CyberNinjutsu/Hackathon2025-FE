"use client"

import { ArrowUpRight, PieChart, TrendingUp } from "lucide-react"
import {
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  PieChart as RechartsPieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts"

const assetData = [
  { name: "Vàng", value: 45, color: "oklch(0.65 0.18 260)" },
  { name: "Bất động sản", value: 35, color: "oklch(0.75 0.15 280)" },
  { name: "Trái phiếu", value: 15, color: "oklch(0.55 0.20 240)" },
  { name: "Cổ phiếu", value: 5, color: "oklch(0.45 0.25 220)" }
]

const valueData = [
  { month: "T1", value: 2500000000 },
  { month: "T2", value: 2800000000 },
  { month: "T3", value: 3200000000 },
  { month: "T4", value: 2900000000 },
  { month: "T5", value: 3500000000 },
  { month: "T6", value: 3800000000 }
]

export default function page() {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0
    }).format(value)
  }

  return (
    <div className='max-w-7xl mx-auto'>
      <div className='space-y-6'>
        {/* Stats Cards */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          <div className='glass-card p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p
                  className='text-sm'
                  style={{ color: "oklch(0.65 0.18 260 / 0.7)" }}
                >
                  Tổng giá trị (VNĐ)
                </p>
                <p className='text-2xl font-bold text-white'>5.25 tỷ</p>
              </div>
              <TrendingUp className='w-8 h-8 text-green-400' />
            </div>
            <div className='flex items-center mt-2'>
              <ArrowUpRight className='w-4 h-4 text-green-400 mr-1' />
              <span className='text-green-400 text-sm'>+12.5%</span>
            </div>
          </div>

          <div className='glass-card p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p
                  className='text-sm'
                  style={{ color: "oklch(0.65 0.18 260 / 0.7)" }}
                >
                  Tổng giá trị (USD)
                </p>
                <p className='text-2xl font-bold text-white'>$218,750</p>
              </div>
              <TrendingUp
                className='w-8 h-8'
                style={{ color: "oklch(0.65 0.18 260)" }}
              />
            </div>
            <div className='flex items-center mt-2'>
              <ArrowUpRight className='w-4 h-4 text-green-400 mr-1' />
              <span className='text-green-400 text-sm'>+8.2%</span>
            </div>
          </div>

          <div className='glass-card p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p
                  className='text-sm'
                  style={{ color: "oklch(0.65 0.18 260 / 0.7)" }}
                >
                  Số loại tài sản
                </p>
                <p className='text-2xl font-bold text-white'>4</p>
              </div>
              <PieChart
                className='w-8 h-8'
                style={{ color: "oklch(0.65 0.18 260)" }}
              />
            </div>
            <div className='flex items-center mt-2'>
              <span
                className='text-sm'
                style={{ color: "oklch(0.65 0.18 260 / 0.7)" }}
              >
                Đa dạng hóa tốt
              </span>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          {/* Asset Allocation */}
          <div className='glass-card p-6'>
            <h3 className='text-lg font-semibold text-white mb-4'>
              Phân bổ tài sản
            </h3>
            <div className='h-64'>
              <ResponsiveContainer width='100%' height='100%'>
                <RechartsPieChart>
                  <RechartsPieChart
                    data={assetData}
                    cx='50%'
                    cy='50%'
                    outerRadius={80}
                  >
                    {assetData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </RechartsPieChart>
                  <Tooltip />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
            <div className='grid grid-cols-2 gap-2 mt-4'>
              {assetData.map((item, index) => (
                <div key={index} className='flex items-center'>
                  <div
                    className='w-3 h-3 rounded-full mr-2'
                    style={{ backgroundColor: item.color }}
                  />
                  <span
                    className='text-sm'
                    style={{ color: "oklch(0.65 0.18 260 / 0.8)" }}
                  >
                    {item.name}: {item.value}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Value Trend */}
          <div className='glass-card p-6'>
            <h3 className='text-lg font-semibold text-white mb-4'>
              Biến động giá trị
            </h3>
            <div className='h-64'>
              <ResponsiveContainer width='100%' height='100%'>
                <LineChart data={valueData}>
                  <CartesianGrid
                    strokeDasharray='3 3'
                    stroke='oklch(0.65 0.18 260 / 0.3)'
                  />
                  <XAxis dataKey='month' stroke='oklch(0.65 0.18 260 / 0.7)' />
                  <YAxis
                    stroke='oklch(0.65 0.18 260 / 0.7)'
                    tickFormatter={(value) => `${value / 1000000000}B`}
                  />
                  <Tooltip
                    formatter={(value: number) => [
                      formatCurrency(value),
                      "Giá trị"
                    ]}
                    labelStyle={{ color: "#1F2937" }}
                  />
                  <Line
                    type='monotone'
                    dataKey='value'
                    stroke='oklch(0.65 0.18 260)'
                    strokeWidth={3}
                    dot={{
                      fill: "oklch(0.65 0.18 260)",
                      strokeWidth: 2,
                      r: 4
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
