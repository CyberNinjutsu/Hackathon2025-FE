import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Plus } from "lucide-react"

export default function NewToken() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Plus className='w-5 h-5' />
          Tokenize tài sản mới
        </CardTitle>
        <CardDescription>
          Chuyển đổi tài sản thực thành token số
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button className='w-full'>Bắt đầu tokenize</Button>
      </CardContent>
    </Card>
  )
}
