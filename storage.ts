export interface AppSettings {
  language: string
  lowDataMode: boolean
  alertsEnabled: boolean
  liveTracking: boolean
  notifications: boolean
  audioMuted: boolean
  apiUrl: string
  theme: "light" | "dark" | "system"
  pollingInterval: number
  vibrationEnabled: boolean
}

export interface RouteData {
  id: string
  name: string
  startPoint: string
  endPoint: string
  eta: string
  fullness: "light" | "medium" | "heavy"
  isPinned: boolean
  lastUpdated: Date
}

export interface AlertData {
  id: string
  routeId: string
  routeName: string
  type: "stop" | "time"
  value: string
  minutes: number
  isActive: boolean
  createdAt: Date
  targetTime: Date
}

export interface FullnessReport {
  routeId: string
  fullness: "light" | "medium" | "heavy"
  reportedAt: Date
  userId?: string
}

const STORAGE_KEYS = {
  SETTINGS: "raaste-settings",
  ROUTES: "raaste-routes",
  ALERTS: "raaste-alerts",
  FULLNESS_REPORTS: "raaste-fullness-reports",
  PINNED_ROUTES: "raaste-pinned-routes",
  SEARCH_HISTORY: "raaste-search-history",
  OFFLINE_DATA: "raaste-offline-data",
  LAST_SYNC: "raaste-last-sync",
} as const

const DEFAULT_SETTINGS: AppSettings = {
  language: "en",
  lowDataMode: false,
  alertsEnabled: true,
  liveTracking: true,
  notifications: true,
  audioMuted: false,
  apiUrl: "https://api.raaste.punjab.gov.in",
  theme: "system",
  pollingInterval: 10000,
  vibrationEnabled: true,
}

export class StorageManager {
  private static instance: StorageManager
  private settings: AppSettings = DEFAULT_SETTINGS

  private constructor() {
    this.loadSettings()
  }

  static getInstance(): StorageManager {
    if (!StorageManager.instance) {
      StorageManager.instance = new StorageManager()
    }
    return StorageManager.instance
  }

  // Settings Management
  getSettings(): AppSettings {
    return { ...this.settings }
  }

  updateSettings(updates: Partial<AppSettings>): void {
    this.settings = { ...this.settings, ...updates }
    this.saveSettings()
  }

  private loadSettings(): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS)
      if (stored) {
        this.settings = { ...DEFAULT_SETTINGS, ...JSON.parse(stored) }
      }
    } catch (error) {
      console.error("Failed to load settings:", error)
      this.settings = DEFAULT_SETTINGS
    }
  }

  private saveSettings(): void {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(this.settings))
    } catch (error) {
      console.error("Failed to save settings:", error)
    }
  }

  // Routes Management
  getRoutes(): RouteData[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ROUTES)
      if (stored) {
        return JSON.parse(stored).map((route: any) => ({
          ...route,
          lastUpdated: new Date(route.lastUpdated),
        }))
      }
    } catch (error) {
      console.error("Failed to load routes:", error)
    }
    return []
  }

  saveRoutes(routes: RouteData[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.ROUTES, JSON.stringify(routes))
    } catch (error) {
      console.error("Failed to save routes:", error)
    }
  }

  // Alerts Management
  getAlerts(): AlertData[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ALERTS)
      if (stored) {
        return JSON.parse(stored).map((alert: any) => ({
          ...alert,
          createdAt: new Date(alert.createdAt),
          targetTime: new Date(alert.targetTime),
        }))
      }
    } catch (error) {
      console.error("Failed to load alerts:", error)
    }
    return []
  }

  saveAlerts(alerts: AlertData[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.ALERTS, JSON.stringify(alerts))
    } catch (error) {
      console.error("Failed to save alerts:", error)
    }
  }

  // Fullness Reports Management
  getFullnessReports(): FullnessReport[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.FULLNESS_REPORTS)
      if (stored) {
        return JSON.parse(stored).map((report: any) => ({
          ...report,
          reportedAt: new Date(report.reportedAt),
        }))
      }
    } catch (error) {
      console.error("Failed to load fullness reports:", error)
    }
    return []
  }

  saveFullnessReport(report: FullnessReport): void {
    try {
      const reports = this.getFullnessReports()
      reports.push(report)

      // Keep only last 100 reports to prevent storage bloat
      const recentReports = reports.slice(-100)

      localStorage.setItem(STORAGE_KEYS.FULLNESS_REPORTS, JSON.stringify(recentReports))
    } catch (error) {
      console.error("Failed to save fullness report:", error)
    }
  }

  // Search History Management
  getSearchHistory(): string[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SEARCH_HISTORY)
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error("Failed to load search history:", error)
      return []
    }
  }

  addToSearchHistory(query: string): void {
    if (!query.trim()) return

    try {
      const history = this.getSearchHistory()
      const filtered = history.filter((item) => item !== query)
      const updated = [query, ...filtered].slice(0, 10) // Keep last 10 searches

      localStorage.setItem(STORAGE_KEYS.SEARCH_HISTORY, JSON.stringify(updated))
    } catch (error) {
      console.error("Failed to save search history:", error)
    }
  }

  clearSearchHistory(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.SEARCH_HISTORY)
    } catch (error) {
      console.error("Failed to clear search history:", error)
    }
  }

  // Offline Data Management
  saveOfflineData(data: any): void {
    try {
      const offlineData = {
        data,
        timestamp: new Date().toISOString(),
        version: "1.0",
      }
      localStorage.setItem(STORAGE_KEYS.OFFLINE_DATA, JSON.stringify(offlineData))
    } catch (error) {
      console.error("Failed to save offline data:", error)
    }
  }

  getOfflineData(): any {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.OFFLINE_DATA)
      if (stored) {
        const parsed = JSON.parse(stored)
        return {
          ...parsed,
          timestamp: new Date(parsed.timestamp),
        }
      }
    } catch (error) {
      console.error("Failed to load offline data:", error)
    }
    return null
  }

  // Sync Management
  getLastSyncTime(): Date | null {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.LAST_SYNC)
      return stored ? new Date(stored) : null
    } catch (error) {
      console.error("Failed to load last sync time:", error)
      return null
    }
  }

  updateLastSyncTime(): void {
    try {
      localStorage.setItem(STORAGE_KEYS.LAST_SYNC, new Date().toISOString())
    } catch (error) {
      console.error("Failed to update last sync time:", error)
    }
  }

  // Storage Cleanup
  clearAllData(): void {
    try {
      Object.values(STORAGE_KEYS).forEach((key) => {
        localStorage.removeItem(key)
      })
      this.settings = DEFAULT_SETTINGS
    } catch (error) {
      console.error("Failed to clear all data:", error)
    }
  }

  // Storage Usage
  getStorageUsage(): { used: number; total: number; percentage: number } {
    try {
      let used = 0
      Object.values(STORAGE_KEYS).forEach((key) => {
        const item = localStorage.getItem(key)
        if (item) {
          used += item.length
        }
      })

      // Estimate total available (5MB is typical limit)
      const total = 5 * 1024 * 1024
      const percentage = (used / total) * 100

      return { used, total, percentage }
    } catch (error) {
      console.error("Failed to calculate storage usage:", error)
      return { used: 0, total: 0, percentage: 0 }
    }
  }
}

// Export singleton instance
export const storage = StorageManager.getInstance()

// Utility functions for common operations
export const getStoredSettings = () => storage.getSettings()
export const updateStoredSettings = (updates: Partial<AppSettings>) => storage.updateSettings(updates)
export const getStoredRoutes = () => storage.getRoutes()
export const saveStoredRoutes = (routes: RouteData[]) => storage.saveRoutes(routes)
export const getStoredAlerts = () => storage.getAlerts()
export const saveStoredAlerts = (alerts: AlertData[]) => storage.saveAlerts(alerts)
