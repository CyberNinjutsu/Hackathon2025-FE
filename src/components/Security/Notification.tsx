"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import { Bell } from "lucide-react"
import { useState } from "react"

export default function Notification() {
  const [notifications, setNotifications] = useState({
    transactions: true,
    security: true,
    weekly: false,
    marketing: false,
    price: true
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Bell className='w-5 h-5' />
          Thông báo
        </CardTitle>
        <CardDescription>Cài đặt thông báo và cảnh báo</CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='space-y-4'>
          <div className='flex items-center justify-between'>
            <div className='space-y-0.5'>
              <Label>Thông báo giao dịch</Label>
              <p className='text-sm text-muted-foreground'>
                Nhận thông báo khi có giao dịch mới
              </p>
            </div>
            <Switch
              checked={notifications.transactions}
              onCheckedChange={(checked) =>
                setNotifications({
                  ...notifications,
                  transactions: checked
                })
              }
              className={cn("data-[state=unchecked]:bg-gray-400")}
            />
          </div>
          <Separator />
          <div className='flex items-center justify-between'>
            <div className='space-y-0.5'>
              <Label>Cảnh báo bảo mật</Label>
              <p className='text-sm text-muted-foreground'>
                Thông báo về hoạt động bảo mật
              </p>
            </div>
            <Switch
              checked={notifications.security}
              onCheckedChange={(checked) =>
                setNotifications({ ...notifications, security: checked })
              }
              className={cn("data-[state=unchecked]:bg-gray-400")}
            />
          </div>
          <Separator />
          <div className='flex items-center justify-between'>
            <div className='space-y-0.5'>
              <Label>Thông báo giá</Label>
              <p className='text-sm text-muted-foreground'>
                Cảnh báo thay đổi giá tài sản
              </p>
            </div>
            <Switch
              checked={notifications.price}
              onCheckedChange={(checked) =>
                setNotifications({ ...notifications, price: checked })
              }
              className={cn("data-[state=unchecked]:bg-gray-400")}
            />
          </div>
          <Separator />
          <div className='flex items-center justify-between'>
            <div className='space-y-0.5'>
              <Label>Báo cáo hàng tuần</Label>
              <p className='text-sm text-muted-foreground'>
                Tóm tắt hoạt động hàng tuần
              </p>
            </div>
            <Switch
              checked={notifications.weekly}
              onCheckedChange={(checked) =>
                setNotifications({ ...notifications, weekly: checked })
              }
              className={cn("data-[state=unchecked]:bg-gray-400")}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
