export interface OfflineData {
  routes: any[]
  lastUpdate: Date
  version: string
}

export class OfflineManager {
  private static instance: OfflineManager
  private isOnline: boolean = navigator.onLine
  private listeners: ((online: boolean) => void)[] = []

  private constructor() {
    this.setupEventListeners()
  }

  static getInstance(): OfflineManager {
    if (!OfflineManager.instance) {
      OfflineManager.instance = new OfflineManager()
    }
    return OfflineManager.instance
  }

  private setupEventListeners(): void {
    window.addEventListener("online", () => {
      this.isOnline = true
      this.notifyListeners(true)
    })

    window.addEventListener("offline", () => {
      this.isOnline = false
      this.notifyListeners(false)
    })
  }

  onConnectionChange(callback: (online: boolean) => void): () => void {
    this.listeners.push(callback)
    return () => {
      this.listeners = this.listeners.filter((listener) => listener !== callback)
    }
  }

  private notifyListeners(online: boolean): void {
    this.listeners.forEach((listener) => listener(online))
  }

  isOnlineStatus(): boolean {
    return this.isOnline
  }

  async cacheRouteData(routes: any[]): Promise<void> {
    try {
      const offlineData: OfflineData = {
        routes,
        lastUpdate: new Date(),
        version: "1.0",
      }
      localStorage.setItem("raaste-offline-routes", JSON.stringify(offlineData))
    } catch (error) {
      console.error("Failed to cache route data:", error)
    }
  }

  getCachedRouteData(): OfflineData | null {
    try {
      const cached = localStorage.getItem("raaste-offline-routes")
      if (cached) {
        const data = JSON.parse(cached)
        return {
          ...data,
          lastUpdate: new Date(data.lastUpdate),
        }
      }
    } catch (error) {
      console.error("Failed to get cached route data:", error)
    }
    return null
  }

  async syncWhenOnline(): Promise<void> {
    if (!this.isOnline) return

    try {
      // In a real app, this would sync with the server
      console.log("Syncing data with server...")

      // Update last sync time
      localStorage.setItem("raaste-last-sync", new Date().toISOString())
    } catch (error) {
      console.error("Failed to sync data:", error)
    }
  }
}

export const offlineManager = OfflineManager.getInstance()
