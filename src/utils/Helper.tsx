import { Badge } from "@/components/ui/badge"

const getTransactionIcon = (type: string) => {
  switch (type) {
    case "buy":
      return "📈"
    case "sell":
      return "📉"
    case "receive":
      return "⬇️"
    case "send":
      return "⬆️"
    default:
      return "❓"
  }
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case "completed":
      return <Badge className='bg-green-600'>Success</Badge>
    case "pending":
      return <Badge className='bg-yellow-600'>Progress</Badge>
    case "failed":
      return <Badge className='bg-red-600'>Failed</Badge>
    default:
      return null
  }
}

export { getTransactionIcon, getStatusBadge }
