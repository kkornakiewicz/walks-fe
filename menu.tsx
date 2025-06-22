import {
  Divider,
  Drawer,
  Group,
  Space,
  Switch,
  Text,
  Title,
} from "@mantine/core"
import React from "react"
import { MapSettings } from "./types"

const Stat = ({ label, value }: { label: string; value: string }) => (
  <Group gap="xs">
    <Title order={4}>{label}</Title>
    <Text>{value}</Text>
  </Group>
)

function Menu(props: {
  opened: boolean
  close: () => void
  open: () => void
  mapSettings: MapSettings
  setShowStreets: (showStreets: boolean) => void
  setShowNodes: (showNodes: boolean) => void
  setShowCurrentLocation: (showCurrentLocation: boolean) => void
  stats: {
    completed: string
    walks: string
    totalWalked: string
    lastUpdated: string
  }
}) {
  const { showStreets, showNodes, showCurrentLocation } = props.mapSettings
  return (
    <>
      <Drawer
        opened={props.opened}
        onClose={props.close}
        title={
          <>
            <Title>One street at a time</Title>
          </>
        }
        position="right"
      >
        <Divider my="md" />
        <Text>
          Hi, I am Krzysztof. In 2024, I decided to walk every street in
          Barcelona—more than 4,000 in total. To help myself navigate, I wrote a
          bunch of scripts to crunch data and visualize the progress.
        </Text>
        <Space h="md" />
        <Text>This page is the public part of it.</Text>
        <Divider my="md" />
        <Title order={4}>Controls:</Title>
        <Space h="md" />
        <Group>
          <Switch
            checked={showStreets}
            onChange={event =>
              props.setShowStreets(event.currentTarget.checked)
            }
            label="Show visited streets"
          />
          <Switch
            defaultChecked
            label="Show missing nodes"
            checked={showNodes}
            onChange={event => props.setShowNodes(event.currentTarget.checked)}
          />
          <Switch
            checked={showCurrentLocation}
            onChange={event =>
              props.setShowCurrentLocation(event.currentTarget.checked)
            }
            label="Show current location"
          />
        </Group>
        <Divider my="md" />

        <Stat label="Completed:" value={props.stats.completed} />
        <Stat label="Walks:" value={props.stats.walks} />
        <Stat label="Total walked:" value={props.stats.totalWalked} />
        <Stat label="Last updated:" value={props.stats.lastUpdated} />
        <Space h="xl" />
        <Divider my="lg" />
        <Text>
          ♥ Made and walked in Barcelona,{" "}
          <a href="https://kornakiewi.cz/contact/"> say hi.</a>{" "}
        </Text>
      </Drawer>
    </>
  )
}

export default Menu
