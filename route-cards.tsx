"use client"

import { useState } from "react"
import { Pin, PinOff, Bell, AlertTriangle, Users, Clock, MapPin, MoreVertical, Timer, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { AlertCreationDialog } from "@/components/alert-creation-dialog"
import { useAlerts } from "@/components/alert-system"
import { useToast } from "@/components/toast-provider"
import { CountdownTimer } from "@/components/countdown-timer"
import { useLanguage } from "@/contexts/language-context"

export interface Route {
  id: string
  name: string
  startPoint: string
  endPoint: string
  eta: string
  fullness: "light" | "medium" | "heavy"
  isPinned: boolean
}

interface RouteCardsProps {
  routes: Route[]
  onRoutesChange: (routes: Route[]) => void
  lowDataMode?: boolean
}

export function RouteCards({ routes, onRoutesChange, lowDataMode = false }: RouteCardsProps) {
  const [showFullnessDialog, setShowFullnessDialog] = useState<string | null>(null)
  const [showAlertDialog, setShowAlertDialog] = useState<{ routeId: string; routeName: string } | null>(null)
  const { alerts, addAlert, removeAlert } = useAlerts() // Added removeAlert function
  const { showToast } = useToast()
  const { t, translateLocation } = useLanguage()

  const togglePin = (routeId: string) => {
    const updatedRoutes = routes.map((route) =>
      route.id === routeId ? { ...route, isPinned: !route.isPinned } : route,
    )
    onRoutesChange(updatedRoutes)

    const route = routes.find((r) => r.id === routeId)
    showToast(`${t.route} ${route?.isPinned ? "unpinned" : "pinned"}: ${route?.name}`, "success")
  }

  const setAlert = (routeId: string, routeName: string) => {
    setShowAlertDialog({ routeId, routeName })
  }

  const handleAlertCreated = (alert: {
    routeId: string
    routeName: string
    type: "stop" | "time"
    value: string
    minutes: number
  }) => {
    addAlert(alert)
    setShowAlertDialog(null)
  }

  const reportFullness = (routeId: string, fullness: Route["fullness"]) => {
    const updatedRoutes = routes.map((route) => (route.id === routeId ? { ...route, fullness } : route))
    onRoutesChange(updatedRoutes)

    const route = routes.find((r) => r.id === routeId)
    const fullnessText = fullness === "light" ? t.empty : fullness === "medium" ? t.moderate : t.crowded
    showToast(`Reported ${fullnessText} occupancy for ${route?.name}`, "success")
    setShowFullnessDialog(null)
  }

  const getActiveAlertForRoute = (routeId: string) => {
    return alerts.find((alert) => alert.routeId === routeId && alert.isActive)
  }

  const stopAlert = (alertId: string, routeName: string) => {
    removeAlert(alertId)
    showToast(`Alert stopped for ${routeName}`, "success")
  }

  const getFullnessColor = (fullness: Route["fullness"]) => {
    switch (fullness) {
      case "light":
        return "bg-primary text-primary-foreground"
      case "medium":
        return "bg-amber-500 text-white"
      case "heavy":
        return "bg-destructive text-destructive-foreground"
    }
  }

  const getFullnessIcon = (fullness: Route["fullness"]) => {
    switch (fullness) {
      case "light":
        return <Users className="w-3 h-3" />
      case "medium":
        return <Users className="w-3 h-3" />
      case "heavy":
        return <Users className="w-3 h-3" />
    }
  }

  const getFullnessText = (fullness: Route["fullness"]) => {
    switch (fullness) {
      case "light":
        return t.empty
      case "medium":
        return t.moderate
      case "heavy":
        return t.crowded
    }
  }

  if (routes.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
          <MapPin className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium text-foreground mb-2">No routes found</h3>
        <p className="text-muted-foreground text-balance">
          Try adjusting your search terms or check back later for updated route information.
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-4">
        {routes.map((route) => {
          const activeAlert = getActiveAlertForRoute(route.id)

          return (
            <Card
              key={route.id}
              className={`transition-all duration-200 hover:shadow-md ${route.isPinned ? "ring-2 ring-primary/20 bg-primary/5" : ""} ${activeAlert ? "ring-2 ring-amber-500/30 bg-amber-50/50" : ""}`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="font-mono text-xs">
                        {route.id}
                      </Badge>
                      {!lowDataMode && route.isPinned && <Pin className="w-4 h-4 text-primary" />}
                      {activeAlert && <Bell className="w-4 h-4 text-amber-600" />}
                    </div>
                    <h3 className="font-semibold text-foreground text-balance">{translateLocation(route.name)}</h3>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="w-4 h-4" />
                        <span className="sr-only">Route options</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {!lowDataMode && (
                        <DropdownMenuItem onClick={() => togglePin(route.id)}>
                          {route.isPinned ? (
                            <>
                              <PinOff className="w-4 h-4 mr-2" />
                              Unpin {t.route}
                            </>
                          ) : (
                            <>
                              <Pin className="w-4 h-4 mr-2" />
                              {t.pin} {t.route}
                            </>
                          )}
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onClick={() => setAlert(route.id, route.name)}>
                        <Bell className="w-4 h-4 mr-2" />
                        {t.setAlert}
                      </DropdownMenuItem>
                      {!lowDataMode && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => setShowFullnessDialog(route.id)}>
                            <AlertTriangle className="w-4 h-4 mr-2" />
                            {t.reportFullness}
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="space-y-4">
                  {activeAlert && (
                    <div className="px-2 py-1.5 bg-amber-50 border border-amber-200 rounded-md">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <Timer className="w-3 h-3 text-amber-600 animate-pulse" />
                          <span className="text-xs font-medium text-amber-800">
                            {activeAlert.type === "stop"
                              ? `Stop: ${activeAlert.value}`
                              : `${activeAlert.minutes}${t.minutes} alert`}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <div className="w-3 h-3 text-amber-600 animate-bounce mr-0.5">⏳</div>
                            <CountdownTimer
                              targetTime={activeAlert.targetTime}
                              onComplete={() => {}}
                              className="text-xs font-mono font-semibold text-amber-800"
                            />
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => stopAlert(activeAlert.id, route.name)}
                            className="h-5 w-5 p-0 text-amber-600 hover:text-amber-800 hover:bg-amber-100"
                            title="Stop Alert"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span className="text-pretty">{translateLocation(route.startPoint)}</span>
                    </div>
                    <div className="text-muted-foreground">→</div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span className="text-pretty">{translateLocation(route.endPoint)}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium text-foreground">
                        {t.nextBus}: {route.eta}
                      </span>
                    </div>

                    {!lowDataMode && (
                      <Badge className={getFullnessColor(route.fullness)}>
                        {getFullnessIcon(route.fullness)}
                        <span className="ml-1">{getFullnessText(route.fullness)}</span>
                      </Badge>
                    )}
                  </div>

                  {!lowDataMode && (
                    <div className="flex gap-2 pt-2">
                      <Button
                        variant={route.isPinned ? "default" : "outline"}
                        size="sm"
                        onClick={() => togglePin(route.id)}
                        className="flex-1"
                      >
                        {route.isPinned ? <PinOff className="w-4 h-4 mr-2" /> : <Pin className="w-4 h-4 mr-2" />}
                        {route.isPinned ? "Unpin" : t.pin}
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setAlert(route.id, route.name)}
                        className="flex-1"
                      >
                        <Bell className="w-4 h-4 mr-2" />
                        {t.setAlert}
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {showAlertDialog && (
        <AlertCreationDialog
          open={!!showAlertDialog}
          onOpenChange={() => setShowAlertDialog(null)}
          routeId={showAlertDialog.routeId}
          routeName={showAlertDialog.routeName}
          onAlertCreated={handleAlertCreated}
        />
      )}

      <AlertDialog open={!!showFullnessDialog} onOpenChange={() => setShowFullnessDialog(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t.reportFullness}</AlertDialogTitle>
            <AlertDialogDescription>
              Help other passengers by reporting the current occupancy level of this bus.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-3 py-4">
            <Button
              variant="outline"
              className="w-full justify-start h-auto p-4 bg-transparent"
              onClick={() => showFullnessDialog && reportFullness(showFullnessDialog, "light")}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <Users className="w-4 h-4 text-primary-foreground" />
                </div>
                <div className="text-left">
                  <div className="font-medium">{t.empty}</div>
                  <div className="text-sm text-muted-foreground">Plenty of seats available</div>
                </div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="w-full justify-start h-auto p-4 bg-transparent"
              onClick={() => showFullnessDialog && reportFullness(showFullnessDialog, "medium")}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center">
                  <Users className="w-4 h-4 text-white" />
                </div>
                <div className="text-left">
                  <div className="font-medium">{t.moderate}</div>
                  <div className="text-sm text-muted-foreground">Some seats available</div>
                </div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="w-full justify-start h-auto p-4 bg-transparent"
              onClick={() => showFullnessDialog && reportFullness(showFullnessDialog, "heavy")}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-destructive rounded-full flex items-center justify-center">
                  <Users className="w-4 h-4 text-destructive-foreground" />
                </div>
                <div className="text-left">
                  <div className="font-medium">{t.crowded}</div>
                  <div className="text-sm text-muted-foreground">Very crowded, standing room only</div>
                </div>
              </div>
            </Button>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel>{t.cancel}</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
