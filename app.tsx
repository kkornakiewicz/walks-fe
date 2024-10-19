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

function Root() {
  const [opened, { toggle, open, close }] = useDisclosure(false)
  const [showStreets, setShowStreets] = useState(true)
  const [showNodes, setShowNodes] = useState(false)
  const [showCurrentLocation, setShowCurrentLocation] = useState(false)
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
    if (showCurrentLocation) {
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
  }, [showCurrentLocation])

  const stats = {
    completed: "48.42%",
    walks: "191",
    totalWalked: "1687km",
    lastUpdated: "17 October 2024",
  }

  return (
    <MantineProvider>
      <AppShell header={{ height: 60 }}>
        <AppShell.Header withBorder={false}>
          <Header opened={opened} toggle={toggle} />
        </AppShell.Header>

        <AppShell.Main>
          <Menu
            showCurrentLocation={showCurrentLocation}
            setShowCurrentLocation={setShowCurrentLocation}
            opened={opened}
            close={close}
            open={open}
            showStreets={showStreets}
            setShowStreets={setShowStreets}
            showNodes={showNodes}
            setShowNodes={setShowNodes}
            stats={stats}
          />
          <Container h="100vh" fluid w="100%" p="0">
            <Map
              showNodes={showNodes}
              showStreets={showStreets}
              currentLocation={currentLocation}
              showCurrentLocation={showCurrentLocation}
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
