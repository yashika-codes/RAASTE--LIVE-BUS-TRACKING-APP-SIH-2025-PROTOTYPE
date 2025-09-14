"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Bell, Clock, MapPin, Save } from "lucide-react"
import { useToast } from "@/components/toast-provider"

interface AlertCreationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  routeId: string
  routeName: string
  onAlertCreated: (alert: {
    routeId: string
    routeName: string
    type: "stop" | "time"
    value: string
    minutes: number
  }) => void
}

export function AlertCreationDialog({
  open,
  onOpenChange,
  routeId,
  routeName,
  onAlertCreated,
}: AlertCreationDialogProps) {
  const [alertType, setAlertType] = useState<"stop" | "time">("time")
  const [stopName, setStopName] = useState("")
  const [timeMinutes, setTimeMinutes] = useState("5")
  const { showToast } = useToast()

  const handleCreateAlert = () => {
    if (alertType === "stop" && !stopName.trim()) {
      showToast("Please enter a stop name", "error")
      return
    }

    const alert = {
      routeId,
      routeName,
      type: alertType,
      value: alertType === "stop" ? stopName : timeMinutes,
      minutes: alertType === "time" ? Number.parseInt(timeMinutes) : 5, // Default 5 min for stop alerts
    }

    onAlertCreated(alert)
    onOpenChange(false)

    // Reset form
    setStopName("")
    setTimeMinutes("5")
    setAlertType("time")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Set Alert
          </DialogTitle>
          <DialogDescription>Create an alert for {routeName}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Alert Type Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Alert Type</Label>
            <RadioGroup value={alertType} onValueChange={(value) => setAlertType(value as "stop" | "time")}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="time" id="time" />
                <Label htmlFor="time" className="cursor-pointer flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Time-based Alert
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="stop" id="stop" />
                <Label htmlFor="stop" className="cursor-pointer flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Stop-based Alert
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Time-based Alert Configuration */}
          {alertType === "time" && (
            <div className="space-y-3">
              <Label htmlFor="time-select" className="text-sm font-medium">
                Alert me before arrival
              </Label>
              <Select value={timeMinutes} onValueChange={setTimeMinutes}>
                <SelectTrigger>
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2">2 minutes</SelectItem>
                  <SelectItem value="5">5 minutes</SelectItem>
                  <SelectItem value="10">10 minutes</SelectItem>
                  <SelectItem value="15">15 minutes</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                You'll be notified {timeMinutes} minutes before the bus arrives
              </p>
            </div>
          )}

          {/* Stop-based Alert Configuration */}
          {alertType === "stop" && (
            <div className="space-y-3">
              <Label htmlFor="stop-name" className="text-sm font-medium">
                Stop Name
              </Label>
              <Input
                id="stop-name"
                value={stopName}
                onChange={(e) => setStopName(e.target.value)}
                placeholder="Enter stop name (e.g., City Center, Mall Road)"
              />
              <p className="text-xs text-muted-foreground">You'll be notified when the bus approaches this stop</p>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreateAlert} className="flex items-center gap-2">
            <Save className="w-4 h-4" />
            Create Alert
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
