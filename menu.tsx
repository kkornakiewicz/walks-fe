import React from "react"
import { Text, Title, Drawer, Group, Divider } from "@mantine/core"

function Menu(props: { opened: boolean; close: () => void; open: () => void }) {
  return (
    <>
      <Drawer
        opened={props.opened}
        onClose={props.close}
        title={
          <>
            <Title>One street at time</Title>
          </>
        }
        position="right"
      >
        <Divider my="md"/>
        <Text>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </Text>
        <Divider my="md"/>
        <Group gap="xs">
          <Text size="lg" fw="500">
            Completed:
          </Text>
          <Text size="lg"> 45.61%</Text>
        </Group>
        <Group gap="xs">
          <Text size="lg" fw="500">
            Walked:
          </Text>
          <Text size="lg"> 1558km</Text>
        </Group>
      </Drawer>
    </>
  )
}

export default Menu
