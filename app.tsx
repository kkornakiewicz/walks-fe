import "maplibre-gl/dist/maplibre-gl.css"
import "@mantine/core/styles.css"

import { AppShell, Container } from "@mantine/core"
import { MantineProvider } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import React, { useState, useEffect } from "react"
import { createRoot } from "react-dom/client"
import Header from "./header"
import Map from "./map"
import Menu from "./menu"
import { MapViewState } from "deck.gl"
import { MapSettings } from "./types"

const stats = {
  completed: "60.37%",
  walks: "278",
  totalWalked: "2437km",
  lastUpdated: "April 6th, 2025",
}

function Root() {
  const [opened, { toggle, open, close }] = useDisclosure(false)
  const [mapSettings, setMapSettings] = useState<MapSettings>({
    showStreets: true,
    showNodes: false,
    showCurrentLocation: false,
  })

  const setShowStreets = (x: boolean) =>
    setMapSettings({ ...mapSettings, showStreets: x })
  const setShowNodes = (x: boolean) =>
    setMapSettings({ ...mapSettings, showNodes: x })
  const setShowCurrentLocation = (x: boolean) =>
    setMapSettings({ ...mapSettings, showCurrentLocation: x })

  const [currentLocation, setCurrentLocation] = useState<
    [number, number] | null
  >(null)
  const [intervalState, setIntervalState] = useState<NodeJS.Timeout | null>(
    null,
  )
  const [viewState, setViewState] = useState<MapViewState>({
    latitude: 41.38685633118305,
    longitude: 2.1696874299405295,
    zoom: 12.5,
    bearing: 0,
    pitch: 30,
  })

  const setLocationAndZoom = (lat: number, lng: number, zoom: number) => {
    setViewState({
      latitude: lat,
      longitude: lng,
      zoom: zoom,
    })
  }

  // Update current location every 10 seconds
  useEffect(() => {
    if (mapSettings.showCurrentLocation) {
      // Show current location on the map
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
          setCurrentLocation([
            position.coords.longitude,
            position.coords.latitude,
          ])
          setLocationAndZoom(
            position.coords.latitude,
            position.coords.longitude,
            15,
          )
        })
      }

      // Update current location every 10 seconds
      const _interval = setInterval(() => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(position => {
            setCurrentLocation([
              position.coords.longitude,
              position.coords.latitude,
            ])
          })
        }
      }, 10000)
      setIntervalState(_interval)
    } else {
      // Stop updating current location if the user doesn't want to see it
      if (intervalState) {
        clearInterval(intervalState)
      }
    }
  }, [mapSettings.showCurrentLocation])

  return (
    <MantineProvider>
      <AppShell header={{ height: 60 }}>
        <AppShell.Header withBorder={false}>
          <Header opened={opened} toggle={toggle} />
        </AppShell.Header>
        <AppShell.Main>
          <Menu
            opened={opened}
            close={close}
            open={open}
            stats={stats}
            mapSettings={mapSettings}
            setShowStreets={setShowStreets}
            setShowNodes={setShowNodes}
            setShowCurrentLocation={setShowCurrentLocation}
          />
          <Container h="100vh" fluid w="100%" p="0">
            <Map
              mapSettings={mapSettings}
              currentLocation={currentLocation}
              viewState={viewState}
              setViewState={setViewState}
            />
          </Container>
        </AppShell.Main>
      </AppShell>
    </MantineProvider>
  )
}

/* global document */
const container = document.body.appendChild(document.createElement("div"))
createRoot(container).render(<Root />)
