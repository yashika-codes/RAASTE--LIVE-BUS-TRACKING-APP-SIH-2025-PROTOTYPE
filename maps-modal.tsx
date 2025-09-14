"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Map, Download, Eye, FileText } from "lucide-react"

interface MapsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

// Mock route maps data
const routeMaps = [
  {
    id: "chandigarh-ludhiana",
    name: "Chandigarh - Ludhiana Route",
    type: "PDF",
    size: "2.3 MB",
    description: "Complete route map with all stops and timings",
    preview: "/chandigarh-ludhiana-bus-route-map.jpg",
    routes: ["PB001", "PB004", "PB007"],
  },
  {
    id: "amritsar-jalandhar",
    name: "Amritsar - Jalandhar Route",
    type: "PDF",
    size: "1.8 MB",
    description: "Local route with city connections",
    preview: "/placeholder-5pe3q.png",
    routes: ["PB002", "PB005"],
  },
  {
    id: "patiala-mohali",
    name: "Patiala - Mohali Shuttle",
    type: "PDF",
    size: "1.2 MB",
    description: "Shuttle service route map",
    preview: "/patiala-mohali-shuttle-route-map.jpg",
    routes: ["PB003", "PB006"],
  },
  {
    id: "punjab-overview",
    name: "Punjab State Bus Network",
    type: "PDF",
    size: "5.1 MB",
    description: "Complete state-wide bus network overview",
    preview: "/punjab-state-bus-network-overview-map.jpg",
    routes: ["All Routes"],
  },
]

export function MapsModal({ open, onOpenChange }: MapsModalProps) {
  const [selectedMap, setSelectedMap] = useState<string | null>(null)

  const handleViewMap = (mapId: string) => {
    setSelectedMap(mapId)
  }

  const handleDownloadMap = (mapId: string) => {
    // In a real app, this would trigger the download
    console.log("Downloading map:", mapId)
  }

  const selectedMapData = routeMaps.find((map) => map.id === selectedMap)

  if (selectedMap && selectedMapData) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Map className="w-5 h-5" />
              {selectedMapData.name}
            </DialogTitle>
            <DialogDescription>{selectedMapData.description}</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Map Viewer */}
            <div className="relative">
              <img
                src={selectedMapData.preview || "/placeholder.svg"}
                alt={selectedMapData.name}
                className="w-full h-96 object-cover rounded-lg border border-border"
              />
              <div className="absolute top-4 right-4 flex gap-2">
                <Button variant="secondary" size="sm" onClick={() => handleDownloadMap(selectedMapData.id)}>
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>

            {/* Map Info */}
            <Card className="p-4 space-y-3">
              <h3 className="text-lg font-semibold">Route Information</h3>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">File Size:</span>
                <Badge variant="outline">{selectedMapData.size}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Format:</span>
                <Badge variant="outline">{selectedMapData.type}</Badge>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Covered Routes:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {selectedMapData.routes.map((route) => (
                    <Badge key={route} variant="secondary" className="text-xs">
                      {route}
                    </Badge>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setSelectedMap(null)}>
              Back to Maps
            </Button>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Map className="w-5 h-5" />
            Punjab Bus Route Maps
          </DialogTitle>
          <DialogDescription>Downloadable route guides and maps</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {routeMaps.map((map) => (
            <Card key={map.id} className="overflow-hidden">
              <div className="flex">
                {/* Map Preview */}
                <div className="w-32 h-24 flex-shrink-0">
                  <img src={map.preview || "/placeholder.svg"} alt={map.name} className="w-full h-full object-cover" />
                </div>

                {/* Map Details */}
                <div className="flex-1 p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="space-y-1">
                      <h3 className="font-medium text-foreground">{map.name}</h3>
                      <p className="text-sm text-muted-foreground">{map.description}</p>
                    </div>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      {map.type}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">Size: {map.size}</span>
                      <div className="flex gap-1">
                        {map.routes.slice(0, 2).map((route) => (
                          <Badge key={route} variant="secondary" className="text-xs">
                            {route}
                          </Badge>
                        ))}
                        {map.routes.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{map.routes.length - 2}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewMap(map.id)}
                        className="flex items-center gap-1"
                      >
                        <Eye className="w-3 h-3" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownloadMap(map.id)}
                        className="flex items-center gap-1"
                      >
                        <Download className="w-3 h-3" />
                        Download
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
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
