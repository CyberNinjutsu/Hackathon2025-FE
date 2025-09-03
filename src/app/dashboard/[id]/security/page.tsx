"use client"

import KeyAPI from "@/components/Security/KeyAPI"
import Notification from "@/components/Security/Notification"
import Privacy from "@/components/Security/Privacy"
import WalletComponent from "@/components/Security/Wallet"

export default function SecurityPage() {
  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-3xl font-bold text-foreground'>Bảo mật</h1>
        <p className='text-muted-foreground mt-1'>
          Quản lý tài khoản, bảo mật và tùy chỉnh hệ thống
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <WalletComponent />
        <Notification />
        <KeyAPI />
        <Privacy />
      </div>
    </div>
  )
}
