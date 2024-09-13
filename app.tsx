import React, { useState, useEffect } from "react"
import type * as GeoJSON from "geojson"

import "@mantine/core/styles.css"

import { createRoot } from "react-dom/client"
import { AppShell, Container } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { MantineProvider } from "@mantine/core"
import "maplibre-gl/dist/maplibre-gl.css"

import Map from "./map.tsx"
import Menu from "./menu.js"
import Header from "./header.tsx"

const url_edges =
  "https://raw.githubusercontent.com/kkornakiewicz/walks-fe/main/edges.json"
const url_nodes =
  "https://raw.githubusercontent.com/kkornakiewicz/walks-fe/main/nodes.json"

function Root() {
  const [opened, { toggle, open, close }] = useDisclosure(false)
  const [showStreets, setShowStreets] = useState(true)
  const [showNodes, setShowNodes] = useState(false)
  const [, setLoading] = useState(true)
  const [, setError] = useState(null)

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
            showStreets={showStreets}
            setShowStreets={setShowStreets}
            showNodes={showNodes}
            setShowNodes={setShowNodes}
          />
          <Container h="100vh" fluid w="100%" p="0">
            <Map showNodes={showNodes} showStreets={showStreets} />
          </Container>
        </AppShell.Main>
      </AppShell>
    </MantineProvider>
  )
}

/* global document */
const container = document.body.appendChild(document.createElement("div"))
createRoot(container).render(<Root />)
