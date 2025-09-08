import React from "react"
import { Logo } from "./ui/logo"
import Link from "next/link"
import { Button } from "./ui/button"
import { ModeToggle } from "./ui/ModeToggle"

export default function Header() {
  return (
    <header className='border-b border-border'>
      <div className='container mx-auto px-4 py-4 flex items-center justify-between'>
        <Logo />
        <div className='flex items-center gap-4'>
          <ModeToggle />
          <Link href='/login'>
            <Button variant='ghost'>Sign In</Button>
          </Link>
          <Link href='/register'>
            <Button>Get Started</Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
