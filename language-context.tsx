"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

type Language = "en" | "pa" | "hi"

interface Translations {
  // Header
  appName: string
  tagline: string
  lowData: string
  normal: string
  settings: string
  language: string
  routeMaps: string
  liveTracking: string
  alerts: string
  liveUpdates: string
  notifications: string
  on: string
  off: string
  liveTrackingActive: string
  liveTrackingInactive: string
  lowDataMode: string

  // Route Cards
  route: string
  nextBus: string
  minutes: string
  crowded: string
  moderate: string
  empty: string
  pin: string
  reportFullness: string
  setAlert: string
  viewRoute: string

  // Settings Modal
  selectLanguage: string
  english: string
  punjabi: string
  hindi: string

  // Alert System
  alertSet: string
  alertTriggered: string
  busArriving: string

  // Maps
  interactiveMap: string
  pdfMaps: string

  // Live Tracking
  trackingBuses: string

  // Common
  close: string
  save: string
  cancel: string
}

const locationTranslations: Record<Language, Record<string, string>> = {
  en: {
    // Cities
    Chandigarh: "Chandigarh",
    Ludhiana: "Ludhiana",
    Amritsar: "Amritsar",
    Jalandhar: "Jalandhar",
    Patiala: "Patiala",
    Mohali: "Mohali",

    // Places
    ISBT: "ISBT",
    "Bus Stand": "Bus Stand",
    "Railway Station": "Railway Station",
    City: "City",
    "Phase 7": "Phase 7",
  },
  pa: {
    // Cities
    Chandigarh: "ਚੰਡੀਗੜ੍ਹ",
    Ludhiana: "ਲੁਧਿਆਣਾ",
    Amritsar: "ਅੰਮ੍ਰਿਤਸਰ",
    Jalandhar: "ਜਲੰਧਰ",
    Patiala: "ਪਟਿਆਲਾ",
    Mohali: "ਮੋਹਾਲੀ",

    // Places
    ISBT: "ਆਈਐਸਬੀਟੀ",
    "Bus Stand": "ਬੱਸ ਸਟੈਂਡ",
    "Railway Station": "ਰੇਲਵੇ ਸਟੇਸ਼ਨ",
    City: "ਸ਼ਹਿਰ",
    "Phase 7": "ਫੇਜ਼ 7",
  },
  hi: {
    // Cities
    Chandigarh: "चंडीगढ़",
    Ludhiana: "लुधियाना",
    Amritsar: "अमृतसर",
    Jalandhar: "जालंधर",
    Patiala: "पटियाला",
    Mohali: "मोहाली",

    // Places
    ISBT: "आईएसबीटी",
    "Bus Stand": "बस स्टैंड",
    "Railway Station": "रेलवे स्टेशन",
    City: "शहर",
    "Phase 7": "फेज 7",
  },
}

const translations: Record<Language, Translations> = {
  en: {
    // Header
    appName: "RAASTE",
    tagline: "Bus Tracking",
    lowData: "Low Data",
    normal: "Normal",
    settings: "Settings",
    language: "Language",
    routeMaps: "Route Maps",
    liveTracking: "Live Tracking",
    alerts: "Alerts",
    liveUpdates: "Live Updates",
    notifications: "Notifications",
    on: "ON",
    off: "OFF",
    liveTrackingActive: "Live Tracking Active",
    liveTrackingInactive: "Live Tracking Inactive",
    lowDataMode: "Low Data Mode",

    // Route Cards
    route: "Route",
    nextBus: "Next bus in",
    minutes: "min",
    crowded: "Crowded",
    moderate: "Moderate",
    empty: "Empty",
    pin: "Pin",
    reportFullness: "Report Fullness",
    setAlert: "Set Alert",
    viewRoute: "View Route",

    // Settings Modal
    selectLanguage: "Select Language",
    english: "English",
    punjabi: "ਪੰਜਾਬੀ (Punjabi)",
    hindi: "हिंदी (Hindi)",

    // Alert System
    alertSet: "Alert set for",
    alertTriggered: "Alert!",
    busArriving: "Bus arriving soon",

    // Maps
    interactiveMap: "Interactive Map",
    pdfMaps: "PDF Maps",

    // Live Tracking
    trackingBuses: "Tracking Buses",

    // Common
    close: "Close",
    save: "Save",
    cancel: "Cancel",
  },
  pa: {
    // Header
    appName: "ਰਾਸਤੇ",
    tagline: "ਬੱਸ ਟਰੈਕਿੰਗ",
    lowData: "ਘੱਟ ਡੇਟਾ",
    normal: "ਸਾਧਾਰਨ",
    settings: "ਸੈਟਿੰਗਾਂ",
    language: "ਭਾਸ਼ਾ",
    routeMaps: "ਰੂਟ ਨਕਸ਼ੇ",
    liveTracking: "ਲਾਈਵ ਟਰੈਕਿੰਗ",
    alerts: "ਅਲਰਟ",
    liveUpdates: "ਲਾਈਵ ਅਪਡੇਟ",
    notifications: "ਸੂਚਨਾਵਾਂ",
    on: "ਚਾਲੂ",
    off: "ਬੰਦ",
    liveTrackingActive: "ਲਾਈਵ ਟਰੈਕਿੰਗ ਚਾਲੂ",
    liveTrackingInactive: "ਲਾਈਵ ਟਰੈਕਿੰਗ ਬੰਦ",
    lowDataMode: "ਘੱਟ ਡੇਟਾ ਮੋਡ",

    // Route Cards
    route: "ਰੂਟ",
    nextBus: "ਅਗਲੀ ਬੱਸ",
    minutes: "ਮਿੰਟ",
    crowded: "ਭੀੜ",
    moderate: "ਮੱਧਮ",
    empty: "ਖਾਲੀ",
    pin: "ਪਿੰਨ",
    reportFullness: "ਭਰਪੂਰਤਾ ਦੀ ਰਿਪੋਰਟ",
    setAlert: "ਅਲਰਟ ਸੈੱਟ ਕਰੋ",
    viewRoute: "ਰੂਟ ਦੇਖੋ",

    // Settings Modal
    selectLanguage: "ਭਾਸ਼ਾ ਚੁਣੋ",
    english: "ਅੰਗਰੇਜ਼ੀ",
    punjabi: "ਪੰਜਾਬੀ",
    hindi: "ਹਿੰਦੀ",

    // Alert System
    alertSet: "ਅਲਰਟ ਸੈੱਟ ਕੀਤਾ",
    alertTriggered: "ਅਲਰਟ!",
    busArriving: "ਬੱਸ ਜਲਦੀ ਆ ਰਹੀ ਹੈ",

    // Maps
    interactiveMap: "ਇੰਟਰਐਕਟਿਵ ਨਕਸ਼ਾ",
    pdfMaps: "PDF ਨਕਸ਼ੇ",

    // Live Tracking
    trackingBuses: "ਬੱਸਾਂ ਦੀ ਟਰੈਕਿੰਗ",

    // Common
    close: "ਬੰਦ ਕਰੋ",
    save: "ਸੇਵ ਕਰੋ",
    cancel: "ਰੱਦ ਕਰੋ",
  },
  hi: {
    // Header
    appName: "रास्ते",
    tagline: "बस ट्रैकिंग",
    lowData: "कम डेटा",
    normal: "सामान्य",
    settings: "सेटिंग्स",
    language: "भाषा",
    routeMaps: "रूट मैप्स",
    liveTracking: "लाइव ट्रैकिंग",
    alerts: "अलर्ट",
    liveUpdates: "लाइव अपडेट",
    notifications: "सूचनाएं",
    on: "चालू",
    off: "बंद",
    liveTrackingActive: "लाइव ट्रैकिंग चालू",
    liveTrackingInactive: "लाइव ट्रैकिंग बंद",
    lowDataMode: "कम डेटा मोड",

    // Route Cards
    route: "रूट",
    nextBus: "अगली बस",
    minutes: "मिनट",
    crowded: "भीड़",
    moderate: "मध्यम",
    empty: "खाली",
    pin: "पिन",
    reportFullness: "भरावट रिपोर्ट करें",
    setAlert: "अलर्ट सेट करें",
    viewRoute: "रूट देखें",

    // Settings Modal
    selectLanguage: "भाषा चुनें",
    english: "अंग्रेजी",
    punjabi: "पंजाबी",
    hindi: "हिंदी",

    // Alert System
    alertSet: "अलर्ट सेट किया गया",
    alertTriggered: "अलर्ट!",
    busArriving: "बस जल्दी आ रही है",

    // Maps
    interactiveMap: "इंटरैक्टिव मैप",
    pdfMaps: "PDF मैप्स",

    // Live Tracking
    trackingBuses: "बसों की ट्रैकिंग",

    // Common
    close: "बंद करें",
    save: "सेव करें",
    cancel: "रद्द करें",
  },
}

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: Translations
  translateLocation: (location: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")

  const translateLocation = (location: string): string => {
    const translations = locationTranslations[language]

    // Split location by common separators and translate each part
    let translatedLocation = location

    Object.entries(translations).forEach(([english, translated]) => {
      const regex = new RegExp(`\\b${english}\\b`, "gi")
      translatedLocation = translatedLocation.replace(regex, translated)
    })

    return translatedLocation
  }

  const value = {
    language,
    setLanguage,
    t: translations[language],
    translateLocation,
  }

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
