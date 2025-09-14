"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Accessibility, Eye, Zap, Volume2, Keyboard, X, Settings } from "lucide-react"
import { useAccessibility } from "@/components/accessibility-provider"

interface AccessibilityMenuProps {
  onClose?: () => void
}

export function AccessibilityMenu({ onClose }: AccessibilityMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const {
    highContrast,
    largeText,
    reducedMotion,
    screenReader,
    keyboardNavigation,
    toggleHighContrast,
    toggleLargeText,
    toggleReducedMotion,
    announceToScreenReader,
  } = useAccessibility()

  const handleToggle = () => {
    setIsOpen(!isOpen)
    if (!isOpen) {
      announceToScreenReader("Accessibility menu opened")
    }
  }

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={handleToggle}
        className="fixed top-4 left-4 z-50 bg-background/95 backdrop-blur-sm"
        aria-label="Open accessibility menu"
      >
        <Accessibility className="w-4 h-4" />
        <span className="sr-only">Accessibility Options</span>
      </Button>
    )
  }

  return (
    <div className="fixed top-4 left-4 z-50 w-80 max-w-[calc(100vw-2rem)]">
      <Card className="shadow-lg border-2">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Accessibility className="w-4 h-4" />
              Accessibility Options
            </CardTitle>
            {onClose && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-6 w-6 p-0"
                aria-label="Close accessibility menu"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Visual Accessibility */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Visual
            </h3>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm">High Contrast</Label>
                <p className="text-xs text-muted-foreground">Increase color contrast for better visibility</p>
              </div>
              <Switch
                checked={highContrast}
                onCheckedChange={() => {
                  toggleHighContrast()
                  announceToScreenReader(`High contrast ${!highContrast ? "enabled" : "disabled"}`)
                }}
                aria-label="Toggle high contrast mode"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm">Large Text</Label>
                <p className="text-xs text-muted-foreground">Increase text size for better readability</p>
              </div>
              <Switch
                checked={largeText}
                onCheckedChange={() => {
                  toggleLargeText()
                  announceToScreenReader(`Large text ${!largeText ? "enabled" : "disabled"}`)
                }}
                aria-label="Toggle large text mode"
              />
            </div>
          </div>

          <Separator />

          {/* Motion Accessibility */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Motion
            </h3>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm">Reduce Motion</Label>
                <p className="text-xs text-muted-foreground">Minimize animations and transitions</p>
              </div>
              <Switch
                checked={reducedMotion}
                onCheckedChange={() => {
                  toggleReducedMotion()
                  announceToScreenReader(`Reduced motion ${!reducedMotion ? "enabled" : "disabled"}`)
                }}
                aria-label="Toggle reduced motion mode"
              />
            </div>
          </div>

          <Separator />

          {/* Navigation Status */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Status
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Volume2 className="w-3 h-3" />
                  Screen Reader
                </span>
                <span className={screenReader ? "text-primary" : "text-muted-foreground"}>
                  {screenReader ? "Detected" : "Not detected"}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Keyboard className="w-3 h-3" />
                  Keyboard Navigation
                </span>
                <span className={keyboardNavigation ? "text-primary" : "text-muted-foreground"}>
                  {keyboardNavigation ? "Active" : "Inactive"}
                </span>
              </div>
            </div>
          </div>

          <Separator />

          <div className="text-xs text-muted-foreground">
            <p>Use Tab to navigate, Enter to activate, and Escape to close menus.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
