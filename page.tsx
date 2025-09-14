"use client"

import { useState, useEffect } from "react"
import { SplashScreen } from "@/components/splash-screen"
import { MainApp } from "@/components/main-app"
import { LanguageProvider } from "@/contexts/language-context"

export default function Home() {
  const [showSplash, setShowSplash] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false)
    }, 3000) // Show splash for 3 seconds

    return () => clearTimeout(timer)
  }, [])

  if (showSplash) {
    return <SplashScreen />
  }

  return (
    <LanguageProvider>
      <MainApp />
    </LanguageProvider>
  )
}
