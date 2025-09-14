"use client"

import { useState } from "react"
import { Settings, Bell, BellOff, Wifi, WifiOff, Map, Globe, Navigation } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { SettingsModal } from "@/components/settings-modal"
import { MapsModal } from "@/components/maps-modal"
import { LiveTrackingModal } from "@/components/live-tracking-modal"
import { useToast } from "@/components/toast-provider"
import { useLanguage } from "@/contexts/language-context"
import Image from "next/image"

interface HeaderProps {
  lowDataMode: boolean
  onLowDataModeChange: (enabled: boolean) => void
}

export function Header({ lowDataMode, onLowDataModeChange }: HeaderProps) {
  const [alertsEnabled, setAlertsEnabled] = useState(true)
  const [liveTracking, setLiveTracking] = useState(true)
  const [notifications, setNotifications] = useState(true)
  const [showSettings, setShowSettings] = useState(false)
  const [showMaps, setShowMaps] = useState(false)
  const [showLiveTracking, setShowLiveTracking] = useState(false)
  const { showToast } = useToast()

  const { language, setLanguage, t } = useLanguage()

  const toggleAlerts = () => {
    setAlertsEnabled(!alertsEnabled)
    showToast(`${t.alerts} ${!alertsEnabled ? t.on.toLowerCase() : t.off.toLowerCase()}`, "info")
  }

  const toggleLiveTracking = () => {
    setLiveTracking(!liveTracking)
    showToast(`${t.liveTracking} ${!liveTracking ? t.on.toLowerCase() : t.off.toLowerCase()}`, "info")
  }

  const toggleNotifications = () => {
    setNotifications(!notifications)
    showToast(`${t.notifications} ${!notifications ? t.on.toLowerCase() : t.off.toLowerCase()}`, "info")
  }

  return (
    <>
      <header className="bg-green-100 border-b border-green-200 sticky top-0 z-40 backdrop-blur-sm bg-green-100/95">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo and Title */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 relative">
                <Image
                  src="/raaste-logo.png"
                  alt="RAASTE Logo"
                  width={48}
                  height={48}
                  className="rounded-lg object-contain"
                  priority
                />
              </div>
              <div>
                <h1 className="text-xl font-bold text-green-900">{t.appName}</h1>
                <p className="text-xs text-green-700">{t.tagline}</p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2">
              {/* Low Data Mode Toggle */}
              <Button
                variant={lowDataMode ? "default" : "outline"}
                size="sm"
                onClick={() => onLowDataModeChange(!lowDataMode)}
                className="hidden sm:flex"
              >
                {lowDataMode ? <WifiOff className="w-4 h-4 mr-2" /> : <Wifi className="w-4 h-4 mr-2" />}
                {lowDataMode ? t.lowData : t.normal}
              </Button>

              {/* Settings Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Settings className="w-4 h-4" />
                    <span className="sr-only">{t.settings}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>{t.settings}</DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  {/* Language Selection */}
                  <DropdownMenuItem onClick={() => setShowSettings(true)}>
                    <Globe className="w-4 h-4 mr-2" />
                    {t.language}
                    <Badge variant="secondary" className="ml-auto">
                      {language === "en" ? "EN" : language === "pa" ? "ਪਾ" : "हि"}
                    </Badge>
                  </DropdownMenuItem>

                  {/* Route Maps */}
                  <DropdownMenuItem onClick={() => setShowMaps(true)}>
                    <Map className="w-4 h-4 mr-2" />
                    {t.routeMaps}
                  </DropdownMenuItem>

                  {/* Live Tracking */}
                  <DropdownMenuItem onClick={() => setShowLiveTracking(true)}>
                    <Navigation className="w-4 h-4 mr-2" />
                    {t.liveTracking}
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  {/* Alerts Toggle */}
                  <DropdownMenuItem onClick={toggleAlerts}>
                    {alertsEnabled ? <Bell className="w-4 h-4 mr-2" /> : <BellOff className="w-4 h-4 mr-2" />}
                    {t.alerts}
                    <Badge variant={alertsEnabled ? "default" : "secondary"} className="ml-auto">
                      {alertsEnabled ? t.on : t.off}
                    </Badge>
                  </DropdownMenuItem>

                  {/* Mobile-only controls */}
                  <div className="sm:hidden">
                    <DropdownMenuItem onClick={() => onLowDataModeChange(!lowDataMode)}>
                      {lowDataMode ? <WifiOff className="w-4 h-4 mr-2" /> : <Wifi className="w-4 h-4 mr-2" />}
                      {lowDataMode ? `Disable ${t.lowData}` : `Enable ${t.lowData}`}
                    </DropdownMenuItem>

                    <DropdownMenuItem onClick={() => setShowLiveTracking(true)}>
                      <Navigation className="w-4 h-4 mr-2" />
                      {t.liveTracking}
                    </DropdownMenuItem>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Status Bar */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-green-200">
            <div className="flex items-center gap-4 text-sm text-green-700">
              <div className="flex items-center gap-1">
                <div
                  className={`w-2 h-2 rounded-full ${liveTracking ? "bg-green-600 animate-pulse" : "bg-green-300"}`}
                />
                {liveTracking ? t.liveTrackingActive : t.liveTrackingInactive}
              </div>
              {lowDataMode && (
                <Badge variant="outline" className="text-xs border-green-300 text-green-700">
                  <WifiOff className="w-3 h-3 mr-1" />
                  {t.lowDataMode}
                </Badge>
              )}
            </div>

            <div className="text-sm text-green-700">
              {new Date().toLocaleTimeString("en-IN", {
                timeZone: "Asia/Kolkata",
                hour12: true,
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>
        </div>
      </header>

      {/* Modals */}
      <SettingsModal
        open={showSettings}
        onOpenChange={setShowSettings}
        language={language}
        onLanguageChange={setLanguage}
      />

      <MapsModal open={showMaps} onOpenChange={setShowMaps} />

      <LiveTrackingModal open={showLiveTracking} onOpenChange={setShowLiveTracking} lowDataMode={lowDataMode} />
    </>
  )
}
