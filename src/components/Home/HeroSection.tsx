import Link from "next/link"
import React from "react"
import { Button } from "../ui/button"
import { ArrowRight } from "lucide-react"

export default function HeroSection() {
  return (
    <section className='container mx-auto px-4 py-16 text-center'>
      <h1 className='text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance'>
        Manage Your Digital Assets with{" "}
        <span className='text-primary'>Confidence</span>
      </h1>
      <p className='text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty'>
        Track portfolios, transfer tokens between wallets, and view transaction
        history all in one secure, intuitive platform.
      </p>
      <div className='flex flex-col sm:flex-row gap-4 justify-center'>
        <Link href='/register'>
          <Button size='lg' className='w-full sm:w-auto'>
            Start Managing Assets
            <ArrowRight className='ml-2 h-4 w-4' />
          </Button>
        </Link>
        <Link href='/login'>
          <Button
            variant='outline'
            size='lg'
            className='w-full sm:w-auto bg-transparent'
          >
            Sign In to Account
          </Button>
        </Link>
      </div>
    </section>
  )
}
