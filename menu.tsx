import React from "react"
import { Text, Title, Drawer, Group, Divider, Switch, Space } from "@mantine/core"

function Menu(props: {
  opened: boolean
  close: () => void
  open: () => void
  showStreets: boolean
  setShowStreets: (x: boolean) => void
  showNodes: boolean
  setShowNodes: (x: boolean) => void
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
        <Text>
          This page is the public part of it. Made and walked in Barcelona.
        </Text>
        <Divider my="md" />
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
        </Group>
        <Divider my="md" />
        <Group gap="xs">
          <Title order={4}>Completed:</Title>
          <Text>45.61%</Text>
        </Group>
        <Group gap="xs">
          <Title order={4}>Walks:</Title>
          <Text> 177</Text>
        </Group>
        <Group gap="xs">
          <Title order={4}>Total walked:</Title>
          <Text> 1558km</Text>
        </Group>
        <Group gap="xs">
          <Title order={4}>Last updated:</Title>
          <Text>11 September 2024</Text>
        </Group>
      </Drawer>
    </>
  )
}

export default Menu
