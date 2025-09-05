import React from "react"

export default function Footer() {
  return (
    <footer className='border-t border-white/10 mt-16 backdrop-blur-md bg-white/5 relative z-10'>
      <div className='container mx-auto px-4 py-8'>
        <div className='text-center text-white/70'>
          <p>
            &copy; {new Date().getFullYear()} AssetVault. Secure real-world
            asset tokenization platform.
          </p>
          <p className='text-sm mt-2'>
            Powered by blockchain technology and institutional-grade custody
            solutions
          </p>
        </div>
      </div>
    </footer>
  )
}
