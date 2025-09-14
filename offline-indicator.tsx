"use client"

import { useState, useEffect } from "react"
import { Wifi, WifiOff, RefreshCw, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { offlineManager } from "@/lib/offline"
import { useToast } from "@/components/toast-provider"

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [lastSync, setLastSync] = useState<Date | null>(null)
  const [isSyncing, setIsSyncing] = useState(false)
  const { showToast } = useToast()

  useEffect(() => {
    // Load last sync time
    const savedSync = localStorage.getItem("raaste-last-sync")
    if (savedSync) {
      setLastSync(new Date(savedSync))
    }

    // Listen for connection changes
    const unsubscribe = offlineManager.onConnectionChange((online) => {
      setIsOnline(online)

      if (online) {
        showToast("Connection restored", "success")
        handleSync()
      } else {
        showToast("You're offline. Using cached data.", "warning")
      }
    })

    return unsubscribe
  }, [showToast])

  const handleSync = async () => {
    if (!isOnline) {
      showToast("Cannot sync while offline", "error")
      return
    }

    setIsSyncing(true)
    try {
      await offlineManager.syncWhenOnline()
      setLastSync(new Date())
      showToast("Data synced successfully", "success")
    } catch (error) {
      showToast("Sync failed", "error")
    } finally {
      setIsSyncing(false)
    }
  }

  const formatLastSync = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))

    if (diffMins < 1) return "Just now"
    if (diffMins < 60) return `${diffMins}m ago`

    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours}h ago`

    const diffDays = Math.floor(diffHours / 24)
    return `${diffDays}d ago`
  }

  if (isOnline && lastSync && new Date().getTime() - lastSync.getTime() < 5 * 60 * 1000) {
    // Don't show indicator if online and recently synced
    return null
  }

  return (
    <div className="fixed bottom-4 left-4 z-40 max-w-sm">
      <Card className={`border ${isOnline ? "border-primary/20 bg-primary/5" : "border-amber-500/20 bg-amber-500/5"}`}>
        <CardContent className="p-3">
          <div className="flex items-center gap-3">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                isOnline ? "bg-primary text-primary-foreground" : "bg-amber-500 text-white"
              }`}
            >
              {isOnline ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{isOnline ? "Online" : "Offline"}</span>
                {!isOnline && (
                  <Badge variant="outline" className="text-xs">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    Cached Data
                  </Badge>
                )}
              </div>

              {lastSync && <p className="text-xs text-muted-foreground">Last sync: {formatLastSync(lastSync)}</p>}
            </div>

            {isOnline && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleSync}
                disabled={isSyncing}
                className="h-8 px-2 bg-transparent"
              >
                <RefreshCw className={`w-3 h-3 ${isSyncing ? "animate-spin" : ""}`} />
                <span className="sr-only">Sync data</span>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
