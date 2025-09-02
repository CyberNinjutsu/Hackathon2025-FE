import React from "react"
import { Button } from "../ui/button"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export default function CTA() {
  return (
    <section className='bg-muted/50 py-16'>
      <div className='container mx-auto px-4 text-center'>
        <h2 className='text-3xl font-bold text-foreground mb-4'>
          Ready to Take Control of Your Digital Assets?
        </h2>
        <p className='text-muted-foreground mb-8 max-w-xl mx-auto'>
          Join thousands of users who trust MyTokenHub for their digital asset
          management needs.
        </p>
        <Link href='/register'>
          <Button size='lg'>
            Create Your Account Today
            <ArrowRight className='ml-2 h-4 w-4' />
          </Button>
        </Link>
      </div>
    </section>
  )
}
