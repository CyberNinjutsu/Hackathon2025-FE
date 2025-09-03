"use client"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"

const assets = [
  {
    id: 1,
    type: "Vàng SJC",
    marketValue: "850 triệu VNĐ",
    tokens: "850,000 GOLD",
    issueDate: "15/01/2024",
    status: "Hoạt động"
  },
  {
    id: 2,
    type: "Căn hộ Quận 1",
    marketValue: "1.2 tỷ VNĐ",
    tokens: "1,200,000 REAL",
    issueDate: "20/02/2024",
    status: "Hoạt động"
  },
  {
    id: 3,
    type: "Trái phiếu Chính phủ",
    marketValue: "500 triệu VNĐ",
    tokens: "500,000 BOND",
    issueDate: "10/03/2024",
    expiryDate: "10/03/2029",
    status: "Hoạt động"
  }
]

export default function PortfolioPage() {
  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold text-foreground'>
            Danh mục Tài sản
          </h1>
          <p className='text-muted-foreground mt-1'>
            Quản lý các tài sản đã được token hóa
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách tài sản đã token hóa</CardTitle>
          <CardDescription>
            Chi tiết các tài sản trong danh mục của bạn
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Loại tài sản</TableHead>
                <TableHead>Giá trị thị trường</TableHead>
                <TableHead>Số token</TableHead>
                <TableHead>Ngày phát hành</TableHead>
                <TableHead>Ngày hết hạn</TableHead>
                <TableHead>Trạng thái</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assets.map((asset) => (
                <TableRow key={asset.id}>
                  <TableCell className='font-medium'>{asset.type}</TableCell>
                  <TableCell>{asset.marketValue}</TableCell>
                  <TableCell>{asset.tokens}</TableCell>
                  <TableCell>{asset.issueDate}</TableCell>
                  <TableCell>{asset.expiryDate || "—"}</TableCell>
                  <TableCell>
                    <Badge
                      variant='secondary'
                      className='bg-green-100 text-green-800'
                    >
                      {asset.status}
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
