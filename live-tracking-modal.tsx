"use client"

import { useState, useEffect, useRef } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Navigation, RefreshCw, Wifi, WifiOff, Bus, Clock, Users } from "lucide-react"
import { useToast } from "@/components/toast-provider"

interface LiveTrackingModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  routeId?: string
  lowDataMode?: boolean
}

interface BusLocation {
  id: string
  routeId: string
  lat: number
  lng: number
  heading: number
  speed: number
  occupancy: "light" | "medium" | "heavy"
  lastUpdated: Date
  nextStop: string
  eta: string
}

// Mock bus data for demonstration
const mockBusData: BusLocation[] = [
  {
    id: "BUS001",
    routeId: "PB001",
    lat: 30.7333,
    lng: 76.7794,
    heading: 45,
    speed: 35,
    occupancy: "medium",
    lastUpdated: new Date(),
    nextStop: "Sector 17",
    eta: "5 min",
  },
  {
    id: "BUS002",
    routeId: "PB002",
    lat: 31.634,
    lng: 74.8723,
    heading: 180,
    speed: 28,
    occupancy: "light",
    lastUpdated: new Date(),
    nextStop: "Railway Station",
    eta: "12 min",
  },
  {
    id: "BUS003",
    routeId: "PB003",
    lat: 30.3398,
    lng: 76.3869,
    heading: 90,
    speed: 42,
    occupancy: "heavy",
    lastUpdated: new Date(),
    nextStop: "Phase 7",
    eta: "8 min",
  },
]

export function LiveTrackingModal({ open, onOpenChange, routeId, lowDataMode = false }: LiveTrackingModalProps) {
  const [buses, setBuses] = useState<BusLocation[]>(mockBusData)
  const [isLoading, setIsLoading] = useState(false)
  const [lastUpdate, setLastUpdate] = useState(new Date())
  const mapRef = useRef<HTMLDivElement>(null)
  const { showToast } = useToast()

  // Polling interval based on low data mode
  const pollingInterval = lowDataMode ? 30000 : 10000 // 30s vs 10s

  useEffect(() => {
    if (!open) return

    // Initialize map (simplified - in real app would use Leaflet)
    initializeMap()

    // Set up polling for live data
    const interval = setInterval(() => {
      fetchLiveData()
    }, pollingInterval)

    return () => clearInterval(interval)
  }, [open, pollingInterval])

  const initializeMap = () => {
    if (!mapRef.current) return

    // In a real implementation, this would initialize Leaflet map
    // For now, we'll create a simple visual representation
    mapRef.current.innerHTML = `
      <div class="w-full h-full bg-muted rounded-lg flex items-center justify-center relative overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10"></div>
        <div class="text-center z-10">
          <div class="w-16 h-16 mx-auto mb-4 bg-primary rounded-full flex items-center justify-center">
            <svg class="w-8 h-8 text-primary-foreground" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
          </div>
          <p class="text-sm text-muted-foreground">Interactive Map</p>
          <p class="text-xs text-muted-foreground mt-1">Punjab Bus Network</p>
        </div>
        ${buses
          .map(
            (bus, index) => `
          <div class="absolute w-3 h-3 bg-primary rounded-full animate-pulse" 
               style="left: ${20 + index * 25}%; top: ${30 + index * 15}%;">
          </div>
        `,
          )
          .join("")}
      </div>
    `
  }

  const fetchLiveData = async () => {
    setIsLoading(true)

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, lowDataMode ? 500 : 1000))

      // Simulate bus movement by slightly updating positions
      setBuses((prevBuses) =>
        prevBuses.map((bus) => ({
          ...bus,
          lat: bus.lat + (Math.random() - 0.5) * 0.001,
          lng: bus.lng + (Math.random() - 0.5) * 0.001,
          speed: Math.max(0, bus.speed + (Math.random() - 0.5) * 10),
          lastUpdated: new Date(),
        })),
      )

      setLastUpdate(new Date())

      if (!lowDataMode) {
        initializeMap() // Update map with new positions
      }
    } catch (error) {
      showToast("Failed to update live data", "error")
    } finally {
      setIsLoading(false)
    }
  }

  const getOccupancyColor = (occupancy: string) => {
    switch (occupancy) {
      case "light":
        return "bg-primary text-primary-foreground"
      case "medium":
        return "bg-amber-500 text-white"
      case "heavy":
        return "bg-destructive text-destructive-foreground"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const filteredBuses = routeId ? buses.filter((bus) => bus.routeId === routeId) : buses

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Navigation className="w-5 h-5" />
            Live Bus Tracking
            {lowDataMode && (
              <Badge variant="outline" className="ml-2">
                <WifiOff className="w-3 h-3 mr-1" />
                Low Data
              </Badge>
            )}
          </DialogTitle>
          <DialogDescription>
            Real-time bus locations and status updates
            {routeId && ` for route ${routeId}`}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Status Bar */}
          <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isLoading ? "bg-amber-500 animate-pulse" : "bg-primary"}`} />
                <span className="text-sm font-medium">{isLoading ? "Updating..." : "Live"}</span>
              </div>
              <div className="text-sm text-muted-foreground">
                Last update:{" "}
                {lastUpdate.toLocaleTimeString("en-IN", {
                  hour12: true,
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={fetchLiveData} disabled={isLoading}>
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
              {lowDataMode ? (
                <Badge variant="outline">
                  <WifiOff className="w-3 h-3 mr-1" />
                  30s updates
                </Badge>
              ) : (
                <Badge variant="default">
                  <Wifi className="w-3 h-3 mr-1" />
                  10s updates
                </Badge>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Map View */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Map View
              </h3>
              <div ref={mapRef} className="w-full h-80 border border-border rounded-lg" />
              <p className="text-xs text-muted-foreground text-center">
                {lowDataMode ? "Map updates disabled in low data mode" : "Interactive map with real-time bus positions"}
              </p>
            </div>

            {/* Bus List */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Bus className="w-5 h-5" />
                Active Buses ({filteredBuses.length})
              </h3>
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {filteredBuses.map((bus) => (
                  <Card key={bus.id} className="border border-border">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm font-medium">Bus {bus.id}</CardTitle>
                        <Badge variant="outline" className="text-xs">
                          {bus.routeId}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2">
                          <Navigation className="w-3 h-3 text-muted-foreground" />
                          <span>{bus.speed} km/h</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-3 h-3 text-muted-foreground" />
                          <span>ETA: {bus.eta}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-sm">
                          <span className="text-muted-foreground">Next: </span>
                          <span className="font-medium">{bus.nextStop}</span>
                        </div>
                        <Badge className={getOccupancyColor(bus.occupancy)}>
                          <Users className="w-3 h-3 mr-1" />
                          {bus.occupancy}
                        </Badge>
                      </div>

                      <div className="text-xs text-muted-foreground">
                        Position: {bus.lat.toFixed(4)}, {bus.lng.toFixed(4)}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
