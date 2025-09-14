"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { SearchBar } from "@/components/search-bar"
import { RouteCards } from "@/components/route-cards"
import { AlertProvider } from "@/components/alert-system"
import { ToastProvider } from "@/components/toast-provider"
import { AccessibilityProvider } from "@/components/accessibility-provider"
import { offlineManager } from "@/lib/offline"

// Mock data for routes
const mockRoutes = [
  {
    id: "PB001",
    name: "Chandigarh - Ludhiana Express",
    startPoint: "Chandigarh ISBT",
    endPoint: "Ludhiana Bus Stand",
    eta: "15 min",
    fullness: "medium" as const,
    isPinned: false,
  },
  {
    id: "PB002",
    name: "Amritsar - Jalandhar Local",
    startPoint: "Amritsar Railway Station",
    endPoint: "Jalandhar City",
    eta: "8 min",
    fullness: "light" as const,
    isPinned: false,
  },
  {
    id: "PB003",
    name: "Patiala - Mohali Shuttle",
    startPoint: "Patiala Bus Stand",
    endPoint: "Mohali Phase 7",
    eta: "22 min",
    fullness: "heavy" as const,
    isPinned: false,
  },
]

export function MainApp() {
  const [routes, setRoutes] = useState(mockRoutes)
  const [searchQuery, setSearchQuery] = useState("")
  const [lowDataMode, setLowDataMode] = useState(false)
  const [isOnline, setIsOnline] = useState(navigator.onLine)

  // Load saved data from localStorage
  useEffect(() => {
    const savedRoutes = localStorage.getItem("raaste-routes")
    const savedLowDataMode = localStorage.getItem("raaste-low-data-mode")

    if (savedRoutes) {
      setRoutes(JSON.parse(savedRoutes))
    } else {
      // Cache initial route data for offline use
      offlineManager.cacheRouteData(mockRoutes)
    }

    if (savedLowDataMode) {
      setLowDataMode(JSON.parse(savedLowDataMode))
    }

    // Listen for online/offline changes
    const unsubscribe = offlineManager.onConnectionChange((online) => {
      setIsOnline(online)

      if (!online) {
        // Load cached data when offline
        const cachedData = offlineManager.getCachedRouteData()
        if (cachedData) {
          setRoutes(cachedData.routes)
        }
      }
    })

    return unsubscribe
  }, [])

  // Save routes to localStorage when they change
  useEffect(() => {
    localStorage.setItem("raaste-routes", JSON.stringify(routes))

    // Cache routes for offline use
    if (isOnline) {
      offlineManager.cacheRouteData(routes)
    }
  }, [routes, isOnline])

  // Save low data mode preference
  useEffect(() => {
    localStorage.setItem("raaste-low-data-mode", JSON.stringify(lowDataMode))
  }, [lowDataMode])

  const filteredRoutes = routes.filter(
    (route) =>
      route.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      route.startPoint.toLowerCase().includes(searchQuery.toLowerCase()) ||
      route.endPoint.toLowerCase().includes(searchQuery.toLowerCase()) ||
      route.id.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Sort routes with pinned ones first
  const sortedRoutes = [...filteredRoutes].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1
    if (!a.isPinned && b.isPinned) return 1
    return 0
  })

  return (
    <AccessibilityProvider>
      <ToastProvider>
        <AlertProvider>
          <div className="min-h-screen bg-background">
            <a href="#main-content" className="skip-link">
              Skip to main content
            </a>

            <Header lowDataMode={lowDataMode} onLowDataModeChange={setLowDataMode} />

            <main id="main-content" className="container mx-auto px-4 py-6 space-y-6">
              <SearchBar value={searchQuery} onChange={setSearchQuery} />

              <RouteCards routes={sortedRoutes} onRoutesChange={setRoutes} lowDataMode={lowDataMode} />
            </main>
          </div>
        </AlertProvider>
      </ToastProvider>
    </AccessibilityProvider>
  )
}
