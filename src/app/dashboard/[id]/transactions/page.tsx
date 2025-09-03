"use client"

import Dropdown from "@/components/Transactions/DropdownMenu"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { Check, Filter } from "lucide-react"
import { useState } from "react"

const transactions = [
  {
    id: "TX001",
    type: "Mua",
    asset: "Vàng SJC",
    amount: "100,000 GOLD",
    value: "100 triệu VNĐ",
    date: "25/11/2024",
    status: "Thành công"
  },
  {
    id: "TX002",
    type: "Chuyển nhượng",
    asset: "Căn hộ Quận 1",
    amount: "50,000 REAL",
    value: "50 triệu VNĐ",
    date: "24/11/2024",
    status: "Chờ xử lý"
  },
  {
    id: "TX003",
    type: "Bán",
    asset: "Trái phiếu CP",
    amount: "25,000 BOND",
    value: "25 triệu VNĐ",
    date: "23/11/2024",
    status: "Thành công"
  },
  {
    id: "TX004",
    type: "Mua",
    asset: "Cổ phiếu VIC",
    amount: "75,000 STOCK",
    value: "75 triệu VNĐ",
    date: "22/11/2024",
    status: "Thành công"
  },
  {
    id: "TX005",
    type: "Chuyển nhượng",
    asset: "Đất nền Đà Nẵng",
    amount: "30,000 LAND",
    value: "30 triệu VNĐ",
    date: "21/11/2024",
    status: "Thành công"
  }
]

export default function TransactionsPage() {
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null)

  const filteredTransactions = selectedFilter
    ? transactions.filter((tx) => tx.type === selectedFilter)
    : transactions

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold text-foreground'>
            Lịch sử Giao dịch
          </h1>
          <p className='text-muted-foreground mt-1'>
            Theo dõi tất cả giao dịch mua, bán và chuyển nhượng
          </p>
        </div>
        <Dropdown
          selectedFilter={selectedFilter}
          setSelectedFilter={setSelectedFilter}
        />
      </div>

      <Card>
        <CardHeader>
          <CardDescription>
            {selectedFilter
              ? `Hiển thị ${filteredTransactions.length} giao dịch loại "${selectedFilter}"`
              : `Lịch sử chi tiết các giao dịch của bạn (${filteredTransactions.length} giao dịch)`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã GD</TableHead>
                <TableHead>Loại</TableHead>
                <TableHead>Tài sản</TableHead>
                <TableHead>Số lượng</TableHead>
                <TableHead>Giá trị</TableHead>
                <TableHead>Ngày</TableHead>
                <TableHead>Trạng thái</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((tx) => (
                <TableRow key={tx.id}>
                  <TableCell className='font-medium'>{tx.id}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        tx.type === "Mua"
                          ? "default"
                          : tx.type === "Bán"
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {tx.type}
                    </Badge>
                  </TableCell>
                  <TableCell>{tx.asset}</TableCell>
                  <TableCell>{tx.amount}</TableCell>
                  <TableCell>{tx.value}</TableCell>
                  <TableCell>{tx.date}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        tx.status === "Thành công" ? "secondary" : "outline"
                      }
                    >
                      {tx.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
