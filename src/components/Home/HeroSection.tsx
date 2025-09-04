"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { ArrowUpDown, ChevronRight } from "lucide-react"
import { useState } from "react"

export default function HeroSection() {
  const [fromAmount, setFromAmount] = useState("")
  const [fromToken, setFromToken] = useState("GOLD")
  const toToken = "TOKENIZED_ASSET"

  return (
    <section className='container mx-auto px-4 py-16 text-center relative z-10'>
      <div className='max-w-4xl mx-auto'>
        <h2 className='text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-300 via-blue-300 to-purple-300 bg-clip-text text-transparent leading-tight text-balance'>
          Tokenize Real Assets
          <br />
          <span className='text-4xl md:text-6xl'>Gold & Real Estate</span>
        </h2>
        <p className='text-xl text-white/70 mb-12 max-w-2xl mx-auto leading-relaxed text-pretty'>
          Transform physical assets into digital tokens. Invest in gold, real
          estate, and premium assets through blockchain technology with
          fractional ownership and instant liquidity.
        </p>

        {/* Exchange Widget */}
        <Card className='glass-card max-w-md mx-auto mb-16 p-6'>
          <CardHeader className='text-center pb-4'>
            <CardTitle className='text-2xl font-bold text-purple-300'>
              Asset Tokenization Hub
            </CardTitle>
            <CardDescription className='text-white/60'>
              Submit your assets for digital tokenization
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-6'>
            <div className='space-y-4'>
              <div className='space-y-2'>
                <label className='text-sm font-medium text-white/70'>
                  Asset Type
                </label>
                <Select value={fromToken} onValueChange={setFromToken}>
                  <SelectTrigger className='glass-input w-full text-white'>
                    <SelectValue placeholder='Select asset type' />
                  </SelectTrigger>
                  <SelectContent className='backdrop-blur-xl bg-slate-900/90 border border-white/20 shadow-2xl'>
                    <SelectItem value='GOLD'>Physical Gold</SelectItem>
                    <SelectItem value='SILVER'>Silver Bullion</SelectItem>
                    <SelectItem value='REAL_ESTATE'>
                      Real Estate Property
                    </SelectItem>
                    <SelectItem value='PRECIOUS_METALS'>
                      Precious Metals
                    </SelectItem>
                    <SelectItem value='COMMODITIES'>Commodities</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className='space-y-2'>
                <label className='text-sm font-medium text-white/70'>
                  Asset Value (USD)
                </label>
                <Input
                  placeholder='Enter asset value'
                  value={fromAmount}
                  onChange={(e) => setFromAmount(e.target.value)}
                  className='glass-input text-white placeholder:text-white/50'
                />
              </div>

              <div className='flex justify-center'>
                <div className='glass-card p-2'>
                  <ArrowUpDown className='w-4 h-4 text-purple-300' />
                </div>
              </div>

              <div className='space-y-2'>
                <label className='text-sm font-medium text-white/70'>
                  Estimated Tokens
                </label>
                <div className='glass-input p-3 text-white/70'>
                  {fromAmount
                    ? `${Number.parseFloat(
                        fromAmount
                      ).toLocaleString()} ${toToken} tokens`
                    : "0 tokens"}
                </div>
              </div>
            </div>

            <Button className='glass-button w-full py-6 text-lg font-semibold text-white hover:text-white'>
              Start Tokenization Process
              <ChevronRight className='w-5 h-5 ml-2' />
            </Button>

            <div className='text-center text-sm text-white/60'>
              Verification Required • Processing: 3-7 business days • Custody
              Fee: 0.25%
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
