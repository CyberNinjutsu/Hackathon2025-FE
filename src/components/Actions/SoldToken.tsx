import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { ShoppingCart } from "lucide-react"

export default function SoldToken() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <ShoppingCart className='w-5 h-5' />
          Bán trên marketplace
        </CardTitle>
        <CardDescription>Đăng bán token trên sàn giao dịch</CardDescription>
      </CardHeader>
      <CardContent>
        <Button className='w-full bg-transparent' variant='outline'>
          Đăng bán
        </Button>
      </CardContent>
    </Card>
  )
}
