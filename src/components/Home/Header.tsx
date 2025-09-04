import { ArrowUpDown } from "lucide-react"
import Link from "next/link"
import { Button } from "../ui/button"

export default function Header() {
  return (
    <header className='border-b border-white/10 backdrop-blur-md bg-white/5'>
      <div className='container mx-auto px-4 py-4 flex items-center justify-between'>
        {/* Logo Section */}
        <div className='flex items-center space-x-3'>
          <div className='w-10 h-10 glass-card flex items-center justify-center'>
            <ArrowUpDown className='w-6 h-6 text-purple-300' />
          </div>
          <h1 className='text-2xl font-bold bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent'>
            AssetVault
          </h1>
        </div>

        {/* Navigation */}
        <div className='flex items-center space-x-3'>
          <Button
            variant='ghost'
            className='glass-button text-white hover:text-white'
          >
            <Link href='/login'>Login</Link>
          </Button>

          <Button className='glass-button text-white hover:text-white'>
            <Link href='/signup'>Sign Up</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
