import { Flex, Text } from "@mantine/core"
import { Burger } from "@mantine/core"
import React from "react"

// Header Component
const Header = (props: { opened: boolean; toggle: () => void }) => {
  return (
    <Flex
      justify="space-between"
      p="0 2rem"
      align="center"
      bg="#353C42"
      c="white"
      ff="Gill Sans"
      h="100%"
    >
      <Text size="xl" p="0.5rem" fw="700">
        Walking in Barcelona
      </Text>
      <Burger
        lineSize={2}
        size="md"
        opened={props.opened}
        onClick={props.toggle}
        aria-label="Toggle navigation"
        color="white"
      />
    </Flex>
  )
}

export default Header
