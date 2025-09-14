"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface AccessibilityContextType {
  highContrast: boolean
  largeText: boolean
  reducedMotion: boolean
  screenReader: boolean
  keyboardNavigation: boolean
  toggleHighContrast: () => void
  toggleLargeText: () => void
  toggleReducedMotion: () => void
  announceToScreenReader: (message: string) => void
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined)

export function useAccessibility() {
  const context = useContext(AccessibilityContext)
  if (!context) {
    throw new Error("useAccessibility must be used within AccessibilityProvider")
  }
  return context
}

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [highContrast, setHighContrast] = useState(false)
  const [largeText, setLargeText] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [screenReader, setScreenReader] = useState(false)
  const [keyboardNavigation, setKeyboardNavigation] = useState(false)

  useEffect(() => {
    // Load accessibility preferences
    const savedHighContrast = localStorage.getItem("raaste-high-contrast")
    const savedLargeText = localStorage.getItem("raaste-large-text")
    const savedReducedMotion = localStorage.getItem("raaste-reduced-motion")

    if (savedHighContrast) setHighContrast(JSON.parse(savedHighContrast))
    if (savedLargeText) setLargeText(JSON.parse(savedLargeText))
    if (savedReducedMotion) setReducedMotion(JSON.parse(savedReducedMotion))

    // Detect system preferences
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (prefersReducedMotion && !savedReducedMotion) {
      setReducedMotion(true)
    }

    // Detect screen reader
    const hasScreenReader = window.speechSynthesis || "speechSynthesis" in window
    setScreenReader(hasScreenReader)

    // Detect keyboard navigation
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        setKeyboardNavigation(true)
      }
    }

    const handleMouseDown = () => {
      setKeyboardNavigation(false)
    }

    document.addEventListener("keydown", handleKeyDown)
    document.addEventListener("mousedown", handleMouseDown)

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.removeEventListener("mousedown", handleMouseDown)
    }
  }, [])

  useEffect(() => {
    // Apply accessibility classes to document
    const root = document.documentElement

    if (highContrast) {
      root.classList.add("high-contrast")
    } else {
      root.classList.remove("high-contrast")
    }

    if (largeText) {
      root.classList.add("large-text")
    } else {
      root.classList.remove("large-text")
    }

    if (reducedMotion) {
      root.classList.add("reduced-motion")
    } else {
      root.classList.remove("reduced-motion")
    }

    if (keyboardNavigation) {
      root.classList.add("keyboard-navigation")
    } else {
      root.classList.remove("keyboard-navigation")
    }
  }, [highContrast, largeText, reducedMotion, keyboardNavigation])

  const toggleHighContrast = () => {
    const newValue = !highContrast
    setHighContrast(newValue)
    localStorage.setItem("raaste-high-contrast", JSON.stringify(newValue))
  }

  const toggleLargeText = () => {
    const newValue = !largeText
    setLargeText(newValue)
    localStorage.setItem("raaste-large-text", JSON.stringify(newValue))
  }

  const toggleReducedMotion = () => {
    const newValue = !reducedMotion
    setReducedMotion(newValue)
    localStorage.setItem("raaste-reduced-motion", JSON.stringify(newValue))
  }

  const announceToScreenReader = (message: string) => {
    if (!screenReader) return

    // Create a live region for screen reader announcements
    const announcement = document.createElement("div")
    announcement.setAttribute("aria-live", "polite")
    announcement.setAttribute("aria-atomic", "true")
    announcement.className = "sr-only"
    announcement.textContent = message

    document.body.appendChild(announcement)

    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(announcement)
    }, 1000)
  }

  return (
    <AccessibilityContext.Provider
      value={{
        highContrast,
        largeText,
        reducedMotion,
        screenReader,
        keyboardNavigation,
        toggleHighContrast,
        toggleLargeText,
        toggleReducedMotion,
        announceToScreenReader,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  )
}
