"use client"

import { useState, useEffect, useRef, createContext, useContext, type ReactNode } from "react"
import { Bell, X, Volume2, VolumeX, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/toast-provider"

interface Alert {
  id: string
  routeId: string
  routeName: string
  type: "stop" | "time"
  value: string
  minutes: number
  isActive: boolean
  createdAt: Date
  targetTime: Date
}

interface AlertContextType {
  alerts: Alert[]
  addAlert: (alert: Omit<Alert, "id" | "isActive" | "createdAt" | "targetTime">) => void
  removeAlert: (alertId: string) => void
  stopActiveAlarm: () => void
}

const AlertContext = createContext<AlertContextType | undefined>(undefined)

export function useAlerts() {
  const context = useContext(AlertContext)
  if (!context) {
    throw new Error("useAlerts must be used within an AlertProvider")
  }
  return context
}

export function AlertProvider({ children }: { children: ReactNode }) {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [activeAlarm, setActiveAlarm] = useState<string | null>(null)
  const [isMuted, setIsMuted] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const { showToast } = useToast()

  // Initialize audio element
  useEffect(() => {
    // Create a simple beep sound using Web Audio API
    const createBeepSound = () => {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
      oscillator.type = "sine"

      gainNode.gain.setValueAtTime(0, audioContext.currentTime)
      gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.1)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)

      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.5)
    }

    // Store the beep function
    ;(audioRef as any).current = { play: createBeepSound }

    // Load saved alerts and settings
    const savedAlerts = localStorage.getItem("raaste-alerts")
    const savedMuted = localStorage.getItem("raaste-audio-muted")

    if (savedAlerts) {
      const parsedAlerts = JSON.parse(savedAlerts).map((alert: any) => ({
        ...alert,
        createdAt: new Date(alert.createdAt),
        targetTime: new Date(alert.targetTime),
      }))
      setAlerts(parsedAlerts)
    }

    if (savedMuted) {
      setIsMuted(JSON.parse(savedMuted))
    }
  }, [])

  // Save alerts to localStorage
  useEffect(() => {
    localStorage.setItem("raaste-alerts", JSON.stringify(alerts))
  }, [alerts])

  // Save muted state
  useEffect(() => {
    localStorage.setItem("raaste-audio-muted", JSON.stringify(isMuted))
  }, [isMuted])

  // Check alerts every second
  useEffect(() => {
    const interval = setInterval(() => {
      checkAlerts()
    }, 1000)

    return () => clearInterval(interval)
  }, [alerts, activeAlarm])

  const checkAlerts = () => {
    const now = new Date()

    alerts.forEach((alert) => {
      if (!alert.isActive || activeAlarm) return

      if (now >= alert.targetTime) {
        triggerAlarm(alert)
      }
    })
  }

  const triggerAlarm = (alert: Alert) => {
    setActiveAlarm(alert.id)

    // Play audio if not muted
    if (!isMuted && audioRef.current) {
      try {
        // Play beep sound multiple times
        for (let i = 0; i < 3; i++) {
          setTimeout(() => {
            ;(audioRef.current as any)?.play()
          }, i * 600)
        }
      } catch (error) {
        console.error("Error playing alert sound:", error)
      }
    }

    // Vibrate if supported
    if ("vibrate" in navigator) {
      navigator.vibrate([200, 100, 200, 100, 200, 100, 400])
    }

    // Show toast notification
    showToast(
      `🚌 Alert: ${alert.routeName} - ${alert.type === "stop" ? `Stop: ${alert.value}` : `${alert.minutes} minutes`}`,
      "warning",
    )

    // Mark alert as triggered
    setAlerts((prev) => prev.map((a) => (a.id === alert.id ? { ...a, isActive: false } : a)))
  }

  const stopActiveAlarm = () => {
    setActiveAlarm(null)
    showToast("Alarm stopped", "success")
  }

  const addAlert = (alertData: Omit<Alert, "id" | "isActive" | "createdAt" | "targetTime">) => {
    const now = new Date()
    const targetTime = new Date(now.getTime() + alertData.minutes * 60000)

    const newAlert: Alert = {
      ...alertData,
      id: Math.random().toString(36).substr(2, 9),
      isActive: true,
      createdAt: now,
      targetTime,
    }

    setAlerts((prev) => [...prev, newAlert])
    showToast(`Alert set for ${alertData.routeName}`, "success")
  }

  const removeAlert = (alertId: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== alertId))
    if (activeAlarm === alertId) {
      stopActiveAlarm()
    }
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
    showToast(`Audio alerts ${!isMuted ? "muted" : "unmuted"}`, "info")
  }

  return (
    <AlertContext.Provider value={{ alerts, addAlert, removeAlert, stopActiveAlarm }}>
      {children}

      {/* Active Alarm Overlay */}
      {activeAlarm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md border-destructive bg-destructive/10 animate-pulse">
            <CardHeader className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-destructive rounded-full flex items-center justify-center animate-bounce">
                <Bell className="w-8 h-8 text-destructive-foreground" />
              </div>
              <CardTitle className="text-destructive text-xl">🚌 Bus Alert!</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="p-4 bg-destructive/20 rounded-lg">
                <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-destructive" />
                <p className="text-foreground font-medium">Your bus alert has been triggered!</p>
                <p className="text-sm text-muted-foreground mt-1">Check your route for updates</p>
              </div>

              <div className="flex gap-2 justify-center">
                <Button onClick={stopActiveAlarm} className="flex-1" size="lg">
                  <X className="w-4 h-4 mr-2" />
                  Stop Alarm
                </Button>
                <Button variant="outline" onClick={toggleMute} size="lg">
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </AlertContext.Provider>
  )
}

// Export the AlertSystem component for backward compatibility
export function AlertSystem() {
  return null // The AlertProvider now handles everything
}
