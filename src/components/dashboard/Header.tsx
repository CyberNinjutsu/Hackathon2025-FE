import { Home } from "lucide-react"
import Link from "next/link"

export default function Header() {
  return (
    <header className='glass-card border-b border-white/10 sticky top-0 z-50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-16'>
          <Link href='/' className='flex items-center space-x-2'>
            <div className='glass-card p-2'>
              <Home
                className='w-6 h-6'
                style={{ color: "oklch(0.65 0.18 260)" }}
              />
            </div>
            <span className='text-xl font-bold text-white'>AssetVault</span>
          </Link>

          <div className='flex items-center space-x-4'>
            <div className='glass-card px-4 py-2'>
              <span className='text-white'>Xin chào, User</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
