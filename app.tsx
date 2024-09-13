import "maplibre-gl/dist/maplibre-gl.css"
import "@mantine/core/styles.css"

import { AppShell, Container } from "@mantine/core"
import { MantineProvider } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import React, {useState } from "react"
import { createRoot } from "react-dom/client"

import Header from "./header.tsx"
import Map from "./map.tsx"
import Menu from "./menu.js"

function Root() {
  const [opened, { toggle, open, close }] = useDisclosure(false)
  const [showStreets, setShowStreets] = useState(true)
  const [showNodes, setShowNodes] = useState(false)

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
