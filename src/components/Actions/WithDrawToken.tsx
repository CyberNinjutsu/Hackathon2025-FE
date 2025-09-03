import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Banknote } from "lucide-react"

export default function WithDrawToken() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Banknote className='w-5 h-5' />
          Rút giá trị (Redeem)
        </CardTitle>
        <CardDescription>Chuyển đổi token về tài sản thật</CardDescription>
      </CardHeader>
      <CardContent>
        <Button className='w-full bg-transparent' variant='outline'>
          Redeem token
        </Button>
      </CardContent>
    </Card>
  )
}
