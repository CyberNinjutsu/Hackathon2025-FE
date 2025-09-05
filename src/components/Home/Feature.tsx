import { Card, CardContent } from "@/components/ui/card"
import { Globe, Shield, Zap } from "lucide-react"

export default function Feature() {
  const features = [
    {
      icon: <Shield className='w-8 h-8' />,
      title: "Secure Tokenization",
      description:
        "Transform physical assets into secure digital tokens backed by real-world value and legal frameworks"
    },
    {
      icon: <Zap className='w-8 h-8' />,
      title: "Instant Liquidity",
      description:
        "Convert illiquid assets like real estate and gold into tradeable tokens within minutes"
    },
    {
      icon: <Globe className='w-8 h-8' />,
      title: "Global Access",
      description:
        "Access premium assets worldwide through fractional ownership and blockchain technology"
    }
  ]
  return (
    <section className='container mx-auto px-4 py-16 relative z-10'>
      <div className='text-center mb-12'>
        <h3 className='text-3xl font-bold mb-4 text-purple-300'>
          Why Choose AssetVault?
        </h3>
        <p className='text-white/70 max-w-2xl mx-auto text-pretty'>
          Unlock the value of physical assets through secure tokenization with
          institutional-grade custody and compliance
        </p>
      </div>

      <div className='grid md:grid-cols-3 gap-8 max-w-4xl mx-auto'>
        {features.map((feature, index) => (
          <Card
            key={index}
            className='glass-card text-center p-6 hover:scale-105 transition-all duration-300 hover:bg-white/10'
          >
            <CardContent className='pt-6'>
              <div className='glass-card w-16 h-16 mx-auto mb-4 flex items-center justify-center text-purple-300'>
                {feature.icon}
              </div>
              <h4 className='text-xl font-semibold mb-3 text-purple-300'>
                {feature.title}
              </h4>
              <p className='text-white/70 leading-relaxed text-pretty'>
                {feature.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
