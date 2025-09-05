import { Card, CardContent } from "@/components/ui/card"
import { Building, Coins, Gem, Landmark, TrendingUp } from "lucide-react"

export default function PopularAsset() {
  const popularAssets = [
    {
      symbol: "GOLD",
      name: "Tokenized Gold",
      price: "$2,034/oz",
      change: "+1.2%",
      icon: <Coins className='w-5 h-5' />,
      description: "Physical gold backed tokens"
    },
    {
      symbol: "RE-NYC",
      name: "NYC Real Estate",
      price: "$1,250/sqft",
      change: "+3.8%",
      icon: <Building className='w-5 h-5' />,
      description: "Manhattan property tokens"
    },
    {
      symbol: "SILVER",
      name: "Silver Tokens",
      price: "$24.50/oz",
      change: "-0.5%",
      icon: <Gem className='w-5 h-5' />,
      description: "Premium silver reserves"
    },
    {
      symbol: "RE-LON",
      name: "London Properties",
      price: "£850/sqft",
      change: "+2.1%",
      icon: <Landmark className='w-5 h-5' />,
      description: "Prime London real estate"
    }
  ]

  return (
    <section className='container mx-auto px-4 py-16 relative z-10'>
      <div className='text-center mb-12'>
        <h3 className='text-3xl font-bold mb-4 text-purple-300'>
          Trending Tokenized Assets
        </h3>
        <p className='text-white/70'>
          Track performance of premium real-world assets converted to digital
          tokens
        </p>
      </div>

      <div className='grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto'>
        {popularAssets.map((asset, index) => (
          <Card
            key={index}
            className='glass-card p-4 hover:scale-105 transition-all duration-300 hover:bg-white/10'
          >
            <CardContent className='pt-4'>
              <div className='flex items-center justify-between mb-3'>
                <div className='glass-card w-10 h-10 flex items-center justify-center text-purple-300'>
                  {asset.icon}
                </div>
                <TrendingUp className='w-4 h-4 text-purple-300' />
              </div>
              <h4 className='font-semibold text-white mb-1'>{asset.name}</h4>
              <p className='text-xs text-white/60 mb-2'>{asset.description}</p>
              <p className='text-lg font-bold mb-1 text-white'>{asset.price}</p>
              <p
                className={`text-sm ${
                  asset.change.startsWith("+")
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                {asset.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
