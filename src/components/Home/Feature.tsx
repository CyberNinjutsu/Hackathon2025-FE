import React from "react"
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Shield, TrendingUp, Wallet } from "lucide-react"

export default function Feature() {
  return (
    <section className='container mx-auto px-4 py-16'>
      <div className='text-center mb-12'>
        <h2 className='text-3xl font-bold text-foreground mb-4'>
          Everything You Need for Digital Asset Management
        </h2>
        <p className='text-muted-foreground max-w-2xl mx-auto'>
          MyTokenHub provides comprehensive tools to track, manage, and transfer
          your digital assets securely.
        </p>
      </div>

      <div className='grid md:grid-cols-3 gap-8'>
        <Card className='text-center'>
          <CardHeader>
            <div className='mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4'>
              <TrendingUp className='h-6 w-6 text-primary' />
            </div>
            <CardTitle>Portfolio Tracking</CardTitle>
            <CardDescription>
              Monitor your digital asset portfolio with real-time updates and
              comprehensive analytics.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className='text-center'>
          <CardHeader>
            <div className='mx-auto w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4'>
              <Wallet className='h-6 w-6 text-secondary' />
            </div>
            <CardTitle>Wallet Management</CardTitle>
            <CardDescription>
              Seamlessly transfer tokens between multiple wallets with secure,
              fast transactions.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className='text-center'>
          <CardHeader>
            <div className='mx-auto w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4'>
              <Shield className='h-6 w-6 text-accent' />
            </div>
            <CardTitle>Transaction History</CardTitle>
            <CardDescription>
              Complete transaction history with detailed records and advanced
              filtering options.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </section>
  )
}
