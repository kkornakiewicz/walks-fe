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

function Menu(props: {
  showCurrentLocation: boolean | undefined
  setShowCurrentLocation(checked: boolean): void
  opened: boolean
  close: () => void
  open: () => void
  showStreets: boolean
  setShowStreets: (x: boolean) => void
  showNodes: boolean
  setShowNodes: (x: boolean) => void
  stats: {
    completed: string
    walks: string
    totalWalked: string
    lastUpdated: string
  }
}) {
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
            checked={props.showStreets}
            onChange={event =>
              props.setShowStreets(event.currentTarget.checked)
            }
            label="Show visited streets"
          />
          <Switch
            defaultChecked
            label="Show missing nodes"
            checked={props.showNodes}
            onChange={event => props.setShowNodes(event.currentTarget.checked)}
          />
          <Switch
            checked={props.showCurrentLocation}
            onChange={event =>
              props.setShowCurrentLocation(event.currentTarget.checked)
            }
            label="Show current location"
          />
        </Group>
        <Divider my="md" />
        <Group gap="xs">
          <Title order={4}>Completed:</Title>
          <Text>{props.stats.completed}</Text>
        </Group>
        <Group gap="xs">
          <Title order={4}>Walks:</Title>
          <Text>{props.stats.walks}</Text>
        </Group>
        <Group gap="xs">
          <Title order={4}>Total walked:</Title>
          <Text>{props.stats.totalWalked}</Text>
        </Group>
        <Group gap="xs">
          <Title order={4}>Last updated:</Title>
          <Text>{props.stats.lastUpdated}</Text>
        </Group>
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
