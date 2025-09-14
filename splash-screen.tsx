"use client"

import { MapPin } from "lucide-react"
import Image from "next/image"

export function SplashScreen() {
  return (
    <div className="min-h-screen bg-green-100 flex items-center justify-center">
      <div className="text-center text-green-900">
        <div className="relative mb-8">
          <div className="w-24 h-24 mx-auto flex items-center justify-center">
            <Image
              src="/raaste-logo.png"
              alt="RAASTE Logo"
              width={80}
              height={80}
              className="rounded-lg object-contain"
              priority
            />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-accent rounded-full flex items-center justify-center animate-pulse">
            <MapPin className="w-4 h-4 text-white" />
          </div>
        </div>

        <h1 className="text-4xl font-bold mb-2 text-balance">RAASTE</h1>
        <p className="text-lg opacity-90 mb-4 text-pretty">Bus Tracking</p>
        <p className="text-sm opacity-75 text-pretty">Real-time bus information for citizens</p>

        <div className="mt-8">
          <div className="w-8 h-8 border-2 border-green-300 border-t-green-700 rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    </div>
  )
}
