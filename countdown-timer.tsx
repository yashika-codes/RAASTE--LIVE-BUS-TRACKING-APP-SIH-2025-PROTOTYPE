"use client"

import { useState, useEffect } from "react"
import { Clock } from "lucide-react"

interface CountdownTimerProps {
  targetTime: Date
  onComplete?: () => void
  className?: string
}

export function CountdownTimer({ targetTime, onComplete, className = "" }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<{
    minutes: number
    seconds: number
    isExpired: boolean
  }>({ minutes: 0, seconds: 0, isExpired: false })

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date().getTime()
      const target = targetTime.getTime()
      const difference = target - now

      if (difference <= 0) {
        setTimeLeft({ minutes: 0, seconds: 0, isExpired: true })
        onComplete?.()
        return
      }

      const minutes = Math.floor(difference / (1000 * 60))
      const seconds = Math.floor((difference % (1000 * 60)) / 1000)

      setTimeLeft({ minutes, seconds, isExpired: false })
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)

    return () => clearInterval(interval)
  }, [targetTime, onComplete])

  const formatTime = (num: number) => num.toString().padStart(2, "0")

  if (timeLeft.isExpired) {
    return (
      <div className={`flex items-center gap-1 text-destructive ${className}`}>
        <Clock className="w-4 h-4" />
        <span className="font-mono font-medium">Expired</span>
      </div>
    )
  }

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <Clock className="w-4 h-4" />
      <span className="font-mono font-medium">
        {formatTime(timeLeft.minutes)}:{formatTime(timeLeft.seconds)}
      </span>
    </div>
  )
}
