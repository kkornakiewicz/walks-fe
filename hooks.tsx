import { useState, useEffect } from "react"
import { MapSettings } from "./types"

const STORAGE_KEY = "map-settings"

const defaultMapSettings: MapSettings = {
  showStreets: true,
  showNodes: false,
  showCurrentLocation: false,
}

/**
 * Custom hook to manage map settings with localStorage persistence
 */
export const usePersistedMapSettings = () => {
  const [mapSettings, setMapSettings] = useState<MapSettings>(() => {
    try {
      const savedSettings = localStorage.getItem(STORAGE_KEY)
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings) as MapSettings
        // Validate that all required properties exist
        if (
          typeof parsed.showStreets === "boolean" &&
          typeof parsed.showNodes === "boolean" &&
          typeof parsed.showCurrentLocation === "boolean"
        ) {
          return parsed
        }
      }
    } catch (error) {
      console.warn("Failed to load map settings from localStorage:", error)
    }
    return defaultMapSettings
  })

  // Save to localStorage whenever settings change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(mapSettings))
    } catch (error) {
      console.warn("Failed to save map settings to localStorage:", error)
    }
  }, [mapSettings])

  const setShowStreets = (showStreets: boolean) =>
    setMapSettings(prev => ({ ...prev, showStreets }))

  const setShowNodes = (showNodes: boolean) =>
    setMapSettings(prev => ({ ...prev, showNodes }))

  const setShowCurrentLocation = (showCurrentLocation: boolean) =>
    setMapSettings(prev => ({ ...prev, showCurrentLocation }))

  const resetToDefaults = () => setMapSettings(defaultMapSettings)

  return {
    mapSettings,
    setMapSettings,
    setShowStreets,
    setShowNodes,
    setShowCurrentLocation,
    resetToDefaults,
  }
}
