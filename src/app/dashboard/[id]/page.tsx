"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import {
  ArrowDownRight,
  ArrowUpRight,
  Plus,
  TrendingDown,
  TrendingUp,
  Wallet
} from "lucide-react"
import {
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts"

const portfolioData = [
  { name: "Vàng", value: 45, amount: "2.5 tỷ VNĐ", color: "#FFD700" },
  { name: "Bất động sản", value: 30, amount: "1.8 tỷ VNĐ", color: "#8B4513" },
  { name: "Trái phiếu", value: 15, amount: "900 triệu VNĐ", color: "#3B82F6" },
  { name: "Cổ phiếu", value: 10, amount: "600 triệu VNĐ", color: "#10B981" }
]

const valueHistory = [
  { month: "T1", value: 5200 },
  { month: "T2", value: 5400 },
  { month: "T3", value: 5100 },
  { month: "T4", value: 5600 },
  { month: "T5", value: 5800 },
  { month: "T6", value: 6000 }
]

export default function DashboardPage() {
  const totalValue = "6.0 tỷ VNĐ"
  const monthlyChange = "+8.5%"
  const isPositive = true

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold text-foreground'>
            Tổng quan Tài sản
          </h1>
          <p className='text-muted-foreground mt-1'>
            Theo dõi và quản lý danh mục tài sản số hóa của bạn
          </p>
        </div>
        <div className='flex items-center gap-3'>
          <Button size='sm'>
            <Plus className='w-4 h-4 mr-2 textcen' />
            Tokenize Tài sản
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Tổng giá trị tài sản
            </CardTitle>
            <Wallet className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{totalValue}</div>
            <div
              className={`flex items-center text-xs ${
                isPositive ? "text-green-600" : "text-red-600"
              }`}
            >
              {isPositive ? (
                <TrendingUp className='w-3 h-3 mr-1' />
              ) : (
                <TrendingDown className='w-3 h-3 mr-1' />
              )}
              {monthlyChange} so với tháng trước
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Số loại tài sản
            </CardTitle>
            <ArrowUpRight className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>4</div>
            <p className='text-xs text-muted-foreground'>
              Vàng, BĐS, Trái phiếu, Cổ phiếu
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Giao dịch tháng này
            </CardTitle>
            <ArrowDownRight className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>12</div>
            <p className='text-xs text-muted-foreground'>
              +3 so với tháng trước
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        <Card>
          <CardHeader>
            <CardTitle>Phân bổ tài sản</CardTitle>
            <CardDescription>Tỷ lệ phần trăm theo loại tài sản</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='h-[300px]'>
              <ResponsiveContainer width='100%' height='100%'>
                <PieChart>
                  <Pie
                    data={portfolioData}
                    cx='50%'
                    cy='50%'
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey='value'
                  >
                    {portfolioData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, "Tỷ lệ"]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className='grid grid-cols-2 gap-2 mt-4'>
              {portfolioData.map((item, index) => (
                <div key={index} className='flex items-center gap-2'>
                  <div
                    className='w-3 h-3 rounded-full'
                    style={{ backgroundColor: item.color }}
                  />
                  <span className='text-sm'>
                    {item.name}: {item.value}%
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Biến động giá trị</CardTitle>
            <CardDescription>
              Giá trị danh mục theo thời gian (tỷ VNĐ)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='h-[300px]'>
              <ResponsiveContainer width='100%' height='100%'>
                <LineChart data={valueHistory}>
                  <CartesianGrid strokeDasharray='3 3' />
                  <XAxis dataKey='month' />
                  <YAxis />
                  <Tooltip
                    formatter={(value: number) => [
                      `${value / 100} tỷ VNĐ`,
                      "Giá trị"
                    ]}
                  />
                  <Line
                    type='monotone'
                    dataKey='value'
                    stroke='#3B82F6'
                    strokeWidth={2}
                    dot={{ fill: "#3B82F6" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
