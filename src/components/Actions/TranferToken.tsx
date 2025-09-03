import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Send } from "lucide-react"

export default function TranferToken() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Send className='w-5 h-5' />
          Chuyển nhượng token
        </CardTitle>
        <CardDescription>Gửi token cho người khác</CardDescription>
      </CardHeader>
      <CardContent>
        <Button className='w-full bg-transparent' variant='outline'>
          Chuyển token
        </Button>
      </CardContent>
    </Card>
  )
}
