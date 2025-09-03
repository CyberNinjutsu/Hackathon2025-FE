import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Eye, Key, Trash2 } from "lucide-react"

export default function KeyAPI() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Key className='w-5 h-5' />
          Khóa API
        </CardTitle>
        <CardDescription>Quản lý khóa API cho tích hợp</CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='space-y-3'>
          {[
            {
              name: "API Key #1",
              created: "15/11/2024",
              permissions: "Đọc/Ghi",
              status: "active"
            },
            {
              name: "API Key #2",
              created: "10/11/2024",
              permissions: "Chỉ đọc",
              status: "active"
            },
            {
              name: "API Key #3",
              created: "05/11/2024",
              permissions: "Đọc/Ghi",
              status: "revoked"
            }
          ].map((key, index) => (
            <div
              key={index}
              className='flex items-center justify-between p-3 border rounded-lg'
            >
              <div>
                <p className='font-medium'>{key.name}</p>
                <p className='text-sm text-muted-foreground'>
                  Tạo: {key.created} • {key.permissions}
                </p>
              </div>
              <div className='flex items-center gap-2'>
                <Badge
                  variant={
                    key.status === "active" ? "secondary" : "destructive"
                  }
                >
                  {key.status === "active" ? "Hoạt động" : "Đã thu hồi"}
                </Badge>
                <Button variant='ghost' size='sm'>
                  <Eye className='w-4 h-4' />
                </Button>
                <Button variant='ghost' size='sm'>
                  <Trash2 className='w-4 h-4' />
                </Button>
              </div>
            </div>
          ))}
        </div>
        <Button className='w-full bg-transparent' variant='outline'>
          <Key className='w-4 h-4 mr-2' />
          Tạo API Key mới
        </Button>
      </CardContent>
    </Card>
  )
}
