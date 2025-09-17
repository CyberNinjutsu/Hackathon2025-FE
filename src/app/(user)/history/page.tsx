// app/history/page.tsx
"use client"

import React from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  ArrowDownLeft,
  ArrowLeft,
  ArrowUpRight,
  Download,
  Filter,
  Repeat,
  Search
} from "lucide-react"

import { format } from "date-fns"
import { useRouter } from "next/navigation"

// TODO: Thay thế bằng dữ liệu thật sau này
const staticTransactions = [
  {
    id: "2024-05-20T10:30:00Z|Send|0x1A...fE2D",
    type: "Send",
    assetSymbol: "BTC",
    amount: 0.5,
    value: 34000.25,
    status: "Completed",
    date: "2024-05-20T10:30:00Z",
    address: "0x1A...fE2D"
  },
  {
    id: "2024-05-19T15:00:00Z|Receive|0xB3...aC78",
    type: "Receive",
    assetSymbol: "ETH",
    amount: 10,
    value: 35007.5,
    status: "Completed",
    date: "2024-05-19T15:00:00Z",
    address: "0xB3...aC78"
  },
  {
    id: "2024-05-18T12:00:00Z|Swap",
    type: "Swap",
    assetSymbol: "SOL to USDC",
    amount: 100,
    value: 15020.0,
    status: "Pending",
    date: "2024-05-18T12:00:00Z"
  },
  {
    id: "2024-05-17T09:00:00Z|Send|0x9D...8bFG",
    type: "Send",
    assetSymbol: "ADA",
    amount: 5000,
    value: 2250.0,
    status: "Failed",
    date: "2024-05-17T09:00:00Z",
    address: "0x9D...8bFG"
  },
  {
    id: "2024-05-16T18:45:00Z|Receive|0x5C...hJkL",
    type: "Receive",
    assetSymbol: "DOGE",
    amount: 100000,
    value: 15000.0,
    status: "Completed",
    date: "2024-05-16T18:45:00Z",
    address: "0x5C...hJkL"
  }
]

const transactionIcons = {
  Send: <ArrowUpRight className='h-4 w-4 text-red-400' />,
  Receive: <ArrowDownLeft className='h-4 w-4 text-green-400' />,
  Swap: <Repeat className='h-4 w-4 text-blue-400' />
}

export default function HistoryPage() {
  const router = useRouter()

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white custom-scrollbar pt-24'>
      {/* Background glow effects */}
      <div className='fixed inset-0 pointer-events-none z-0'>
        <div className='absolute top-20 left-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl'></div>
        <div className='absolute bottom-20 right-10 w-80 h-80 bg-cyan-400/10 rounded-full blur-3xl'></div>
      </div>

      {/* Main Content */}
      <div className='container mx-auto px-4 pb-8 relative z-10 space-y-6'>
        <div className='flex flex-col space-y-4'>
          {/* Nút quay lại */}
          <div className='flex items-center justify-between'>
            <button
              className='bg-primary/20 hover:bg-primary/30 border border-primary/40 px-4 py-2 rounded-lg text-sm font-medium text-primary transition-all duration-300 hover:scale-105 flex items-center gap-2'
              onClick={() => router.push("/account")}
            >
              <ArrowLeft className='h-4 w-4' />
              Quay lại
            </button>
            <button className='bg-cyan-400/20 hover:bg-cyan-400/30 border border-cyan-400/40 px-4 py-2 rounded-lg text-sm font-medium text-cyan-400 transition-all duration-300 hover:scale-105 flex items-center gap-2'>
              <Download className='h-4 w-4' />
              Export Dữ liệu
            </button>
          </div>

          {/* Tiêu đề trang */}
          <div className='mb-8'>
            <h1 className='text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-cyan-400 bg-clip-text text-transparent'>
              Transaction History
            </h1>
            <p className='text-gray-400'>
              View and manage all your completed transactions
            </p>
          </div>
        </div>

        {/* --- PHẦN BỘ LỌC VÀ TÌM KIẾM --- */}
        <div className='bg-gradient-to-r from-gray-900/80 to-black/80 backdrop-blur-xl border border-gray-800 rounded-xl shadow-2xl p-6 space-y-6'>
          <div className='flex items-center gap-3'>
            <div className='w-10 h-10 bg-primary/20 border border-primary/30 rounded-lg flex items-center justify-center'>
              <Filter className='h-5 w-5 text-primary' />
            </div>
            <h3 className='text-xl font-semibold text-white'>
              Filter & Search
            </h3>
          </div>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
            <div className='relative'>
              <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400' />
              <Input
                aria-label='Search by address or TxID'
                placeholder='Search by address, TxID...'
                className='bg-gray-800/50 border-gray-700 pl-10 text-white placeholder:text-gray-400 focus:border-primary/50 focus:ring-1 focus:ring-primary/50'
              />
            </div>
            <div>
              <Select>
                <SelectTrigger className='bg-gray-800/50 border-gray-700 text-white focus:border-primary/50 focus:ring-1 focus:ring-primary/50'>
                  <SelectValue placeholder='All transaction types' />
                </SelectTrigger>
                <SelectContent className='bg-gray-800 border-gray-700'>
                  <SelectItem value='all'>All transaction types</SelectItem>
                  <SelectItem value='send'>Send</SelectItem>
                  <SelectItem value='receive'>Receive</SelectItem>
                  <SelectItem value='swap'>Swap</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select>
                <SelectTrigger className='bg-gray-800/50 border-gray-700 text-white focus:border-primary/50 focus:ring-1 focus:ring-primary/50'>
                  <SelectValue placeholder='All assets' />
                </SelectTrigger>
                <SelectContent className='bg-gray-800 border-gray-700'>
                  <SelectItem value='all'>All assets</SelectItem>
                  <SelectItem value='btc'>Bitcoin (BTC)</SelectItem>
                  <SelectItem value='eth'>Ethereum (ETH)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <button className='bg-purple-400/20 hover:bg-purple-400/30 border border-purple-400/40 px-4 py-2 rounded-lg text-sm font-medium text-purple-400 transition-all duration-300 hover:scale-105 w-full'>
                Select time range
              </button>
            </div>
          </div>
        </div>

        {/* --- PHẦN BẢNG DỮ LIỆU --- */}
        <div className='bg-gradient-to-r from-gray-900/80 to-black/80 backdrop-blur-xl border border-gray-800 rounded-xl shadow-2xl overflow-hidden'>
          {/* Bảng cho tablet/desktop */}
          <div className='overflow-x-auto'>
            <Table className='min-w-[600px] hidden sm:table'>
              <TableHeader>
                <TableRow className='border-gray-700 hover:bg-transparent'>
                  <TableHead className='text-white font-semibold'>
                    Type
                  </TableHead>
                  <TableHead className='hidden lg:table-cell text-white font-semibold'>
                    Address
                  </TableHead>
                  <TableHead className='hidden md:table-cell text-white font-semibold'>
                    Amount
                  </TableHead>
                  <TableHead className='hidden md:table-cell text-white font-semibold'>
                    Value
                  </TableHead>
                  <TableHead className='hidden md:table-cell text-white font-semibold'>
                    Status
                  </TableHead>
                  <TableHead className='text-right text-white font-semibold'>
                    Date
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {staticTransactions.map((tx) => (
                  <TableRow
                    key={tx.id}
                    className='border-gray-700 hover:bg-white/5 transition-colors duration-200'
                  >
                    <TableCell className='text-white'>
                      <div className='flex items-center gap-3'>
                        {
                          transactionIcons[
                            tx.type as keyof typeof transactionIcons
                          ]
                        }
                        <span className='font-semibold'>{tx.type}</span>
                      </div>
                    </TableCell>
                    <TableCell className='hidden lg:table-cell text-gray-300 font-mono text-sm'>
                      {tx.address}
                    </TableCell>
                    <TableCell className='hidden md:table-cell text-white font-semibold'>
                      {tx.amount} {tx.assetSymbol}
                    </TableCell>
                    <TableCell className='hidden md:table-cell text-primary font-bold'>
                      ${tx.value.toLocaleString("en-US")}
                    </TableCell>
                    <TableCell className='hidden md:table-cell'>
                      <Badge
                        variant='outline'
                        className={
                          tx.status === "Completed"
                            ? "text-green-400 border-green-400 bg-green-400/10"
                            : tx.status === "Pending"
                            ? "text-yellow-400 border-yellow-400 bg-yellow-400/10"
                            : "text-red-400 border-red-400 bg-red-400/10"
                        }
                      >
                        {tx.status === "Completed"
                          ? "Completed"
                          : tx.status === "Pending"
                          ? "Pending"
                          : "Failed"}
                      </Badge>
                    </TableCell>
                    <TableCell className='text-right text-xs text-gray-400'>
                      {format(new Date(tx.date), "dd/MM/yyyy HH:mm")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Card cho mobile */}
          <div className='sm:hidden space-y-4 p-4'>
            {staticTransactions.map((tx, index) => (
              <div
                key={index}
                className='bg-gray-800/50 border border-gray-700 rounded-lg p-4 transition-all duration-300 hover:border-primary/30'
              >
                <div className='flex justify-between items-center mb-3'>
                  <div className='flex items-center gap-3'>
                    {transactionIcons[tx.type as keyof typeof transactionIcons]}
                    <span className='font-semibold text-white'>{tx.type}</span>
                  </div>
                  <span className='text-xs text-gray-400'>
                    {format(new Date(tx.date), "dd/MM/yyyy HH:mm")}
                  </span>
                </div>
                <div className='mb-3'>
                  <div className='text-white font-semibold mb-1'>
                    {tx.amount} {tx.assetSymbol}
                  </div>
                  {tx.address && (
                    <div className='text-xs text-gray-400 truncate font-mono'>
                      {tx.address}
                    </div>
                  )}
                </div>
                <div className='flex justify-between items-center'>
                  <span className='font-bold text-primary text-lg'>
                    ${tx.value.toLocaleString("en-US")}
                  </span>
                  <Badge
                    variant='outline'
                    className={
                      tx.status === "Completed"
                        ? "text-green-400 border-green-400 bg-green-400/10"
                        : tx.status === "Pending"
                        ? "text-yellow-400 border-yellow-400 bg-yellow-400/10"
                        : "text-red-400 border-red-400 bg-red-400/10"
                    }
                  >
                    {tx.status === "Completed"
                      ? "Completed"
                      : tx.status === "Pending"
                      ? "Pending"
                      : "Failed"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- PHẦN PHÂN TRANG --- */}
        <div className='flex items-center justify-between'>
          <div className='text-sm text-gray-400'>
            Showing 5 transactions out of 50 total
          </div>
          <div className='flex items-center space-x-4'>
            <span className='text-sm text-gray-400'>Page 1 of 10</span>
            <div className='space-x-2'>
              <button className='bg-primary/20 hover:bg-primary/30 border border-primary/40 px-3 py-1 rounded text-sm text-primary transition-all duration-300 hover:scale-105'>
                Previous
              </button>
              <button className='bg-primary/20 hover:bg-primary/30 border border-primary/40 px-3 py-1 rounded text-sm text-primary transition-all duration-300 hover:scale-105'>
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
