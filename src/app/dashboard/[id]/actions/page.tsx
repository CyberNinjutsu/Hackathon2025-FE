import NewToken from "@/components/Actions/NewToken"
import SoldToken from "@/components/Actions/SoldToken"
import TranferToken from "@/components/Actions/TranferToken"
import WithDrawToken from "@/components/Actions/WithDrawToken"

export default function page() {
  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-3xl font-bold text-foreground'>
          Hành động Quản lý
        </h1>
        <p className='text-muted-foreground mt-1'>
          Thực hiện các thao tác với tài sản và token của bạn
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <NewToken />
        <TranferToken />
        <SoldToken />
        <WithDrawToken />
      </div>
    </div>
  )
}
