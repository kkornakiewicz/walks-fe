import React from "react"
import { Text, Title, Drawer, Group, Divider, Switch } from "@mantine/core"

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
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </Text>
        <Divider my="md" />
        <Group>
          <Switch
            checked={props.showStreets}
            onChange={event =>
              props.setShowStreets(event.currentTarget.checked)
            }
            label="Show streets"
          />
          <Switch defaultChecked label="Show nodes"

            checked={props.showNodes}
            onChange={event =>
              props.setShowNodes(event.currentTarget.checked)
            }
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
      </Drawer>
    </>
  )
}

export default Menu
