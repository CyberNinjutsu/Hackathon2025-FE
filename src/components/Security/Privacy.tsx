import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Globe } from "lucide-react"

export default function Privacy() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Globe className='w-5 h-5' />
          Tùy chỉnh & Quyền riêng tư
        </CardTitle>
        <CardDescription>Cài đặt giao diện và quyền riêng tư</CardDescription>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='space-y-4'>
          <div className='space-y-2'>
            <Label>Giao diện</Label>
            <Select defaultValue='system'>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='light'>Sáng</SelectItem>
                <SelectItem value='dark'>Tối</SelectItem>
                <SelectItem value='system'>Theo hệ thống</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className='space-y-2'>
            <Label>Múi giờ</Label>
            <Select defaultValue='asia/ho_chi_minh'>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='asia/ho_chi_minh'>
                  Việt Nam (UTC+7)
                </SelectItem>
                <SelectItem value='utc'>UTC (UTC+0)</SelectItem>
                <SelectItem value='america/new_york'>
                  New York (UTC-5)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className='space-y-2'>
            <Label>Đơn vị tiền tệ</Label>
            <Select defaultValue='vnd'>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='vnd'>VND (₫)</SelectItem>
                <SelectItem value='usd'>USD ($)</SelectItem>
                <SelectItem value='eur'>EUR (€)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Separator />
      </CardContent>
    </Card>
  )
}
