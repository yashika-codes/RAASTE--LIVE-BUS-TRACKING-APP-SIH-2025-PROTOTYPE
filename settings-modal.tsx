"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Globe, Server, Smartphone, Trash2, Download, HardDrive } from "lucide-react"
import { useToast } from "@/components/toast-provider"
import { useLanguage } from "@/contexts/language-context"
import { storage, type AppSettings } from "@/lib/storage"

interface SettingsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  language: string
  onLanguageChange: (language: string) => void
}

export function SettingsModal({ open, onOpenChange, language, onLanguageChange }: SettingsModalProps) {
  const [settings, setSettings] = useState<AppSettings>(storage.getSettings())
  const [storageUsage, setStorageUsage] = useState({ used: 0, total: 0, percentage: 0 })
  const { showToast } = useToast()
  const { setLanguage: setContextLanguage, t } = useLanguage()

  useEffect(() => {
    if (open) {
      setSettings(storage.getSettings())
      setStorageUsage(storage.getStorageUsage())
    }
  }, [open])

  const handleSave = () => {
    onLanguageChange(settings.language)
    setContextLanguage(settings.language as "en" | "pa" | "hi")

    // Save all settings to storage
    storage.updateSettings(settings)

    showToast(`${t.settings} ${t.save.toLowerCase()}d successfully`, "success")
    onOpenChange(false)
  }

  const handleReset = () => {
    const defaultSettings = {
      language: "en",
      lowDataMode: false,
      alertsEnabled: true,
      liveTracking: true,
      notifications: true,
      audioMuted: false,
      apiUrl: "https://api.raaste.punjab.gov.in",
      theme: "system" as const,
      pollingInterval: 10000,
      vibrationEnabled: true,
    }
    setSettings(defaultSettings)
    showToast("Settings reset to defaults", "info")
  }

  const handleClearAllData = () => {
    if (confirm("Are you sure you want to clear all app data? This cannot be undone.")) {
      storage.clearAllData()
      setSettings(storage.getSettings())
      setStorageUsage(storage.getStorageUsage())
      showToast("All app data cleared", "success")
    }
  }

  const handleExportData = () => {
    try {
      const exportData = {
        settings: storage.getSettings(),
        routes: storage.getRoutes(),
        alerts: storage.getAlerts(),
        fullnessReports: storage.getFullnessReports(),
        searchHistory: storage.getSearchHistory(),
        exportedAt: new Date().toISOString(),
        version: "1.0",
      }

      const dataStr = JSON.stringify(exportData, null, 2)
      const dataBlob = new Blob([dataStr], { type: "application/json" })
      const url = URL.createObjectURL(dataBlob)

      const link = document.createElement("a")
      link.href = url
      link.download = `raaste-backup-${new Date().toISOString().split("T")[0]}.json`
      link.click()

      URL.revokeObjectURL(url)
      showToast("Data exported successfully", "success")
    } catch (error) {
      showToast("Failed to export data", "error")
    }
  }

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            {t.settings}
          </DialogTitle>
          <DialogDescription>Configure your RAASTE app preferences</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Language Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Globe className="w-4 h-4" />
                {t.language} / ਭਾਸ਼ਾ / भाषा
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={settings.language}
                onValueChange={(value) => setSettings((prev) => ({ ...prev, language: value }))}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="en" id="en" />
                  <Label htmlFor="en" className="cursor-pointer">
                    {t.english}
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="pa" id="pa" />
                  <Label htmlFor="pa" className="cursor-pointer">
                    {t.punjabi}
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="hi" id="hi" />
                  <Label htmlFor="hi" className="cursor-pointer">
                    {t.hindi}
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* App Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Smartphone className="w-4 h-4" />
                App Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium">{t.lowDataMode}</Label>
                  <p className="text-xs text-muted-foreground">Reduce data usage and update frequency</p>
                </div>
                <Switch
                  checked={settings.lowDataMode}
                  onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, lowDataMode: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium">{t.liveTracking}</Label>
                  <p className="text-xs text-muted-foreground">Enable real-time bus location updates</p>
                </div>
                <Switch
                  checked={settings.liveTracking}
                  onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, liveTracking: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium">{t.alerts}</Label>
                  <p className="text-xs text-muted-foreground">Enable bus arrival alerts</p>
                </div>
                <Switch
                  checked={settings.alertsEnabled}
                  onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, alertsEnabled: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium">{t.notifications}</Label>
                  <p className="text-xs text-muted-foreground">Show system notifications</p>
                </div>
                <Switch
                  checked={settings.notifications}
                  onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, notifications: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium">Audio Alerts</Label>
                  <p className="text-xs text-muted-foreground">Play sound for alerts</p>
                </div>
                <Switch
                  checked={!settings.audioMuted}
                  onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, audioMuted: !checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium">Vibration</Label>
                  <p className="text-xs text-muted-foreground">Vibrate for alerts (mobile only)</p>
                </div>
                <Switch
                  checked={settings.vibrationEnabled}
                  onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, vibrationEnabled: checked }))}
                />
              </div>
            </CardContent>
          </Card>

          {/* API Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Server className="w-4 h-4" />
                API Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="api-url" className="text-sm font-medium">
                  Server URL
                </Label>
                <Input
                  id="api-url"
                  value={settings.apiUrl}
                  onChange={(e) => setSettings((prev) => ({ ...prev, apiUrl: e.target.value }))}
                  placeholder="Enter API server URL"
                  className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">Configure the server endpoint for real-time bus data</p>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Update Interval</Label>
                <RadioGroup
                  value={settings.pollingInterval.toString()}
                  onValueChange={(value) =>
                    setSettings((prev) => ({ ...prev, pollingInterval: Number.parseInt(value) }))
                  }
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="5000" id="5s" />
                    <Label htmlFor="5s" className="cursor-pointer">
                      5 seconds (High frequency)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="10000" id="10s" />
                    <Label htmlFor="10s" className="cursor-pointer">
                      10 seconds (Normal)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="30000" id="30s" />
                    <Label htmlFor="30s" className="cursor-pointer">
                      30 seconds (Low data)
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
          </Card>

          {/* Storage Management */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <HardDrive className="w-4 h-4" />
                Storage Management
              </CardTitle>
              <CardDescription>Manage your app data and storage usage</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Storage Used:</span>
                  <Badge variant="outline">
                    {formatBytes(storageUsage.used)} / {formatBytes(storageUsage.total)}
                  </Badge>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(storageUsage.percentage, 100)}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  {storageUsage.percentage.toFixed(1)}% of available storage used
                </p>
              </div>

              <Separator />

              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleExportData} className="flex-1 bg-transparent">
                  <Download className="w-4 h-4 mr-2" />
                  Export Data
                </Button>
                <Button variant="outline" size="sm" onClick={handleClearAllData} className="flex-1 bg-transparent">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear All Data
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={handleReset} className="flex-1 bg-transparent">
              Reset to Defaults
            </Button>
            <Button onClick={handleSave} className="flex-1">
              {t.save} {t.settings}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
