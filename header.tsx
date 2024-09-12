import { Flex, Text, Title } from "@mantine/core"
import React from "react"

// Header Component
const Header = () => {
  return (
    <Flex justify="space-between" p="0 2rem" align="center" bg="#282c34" c="white" ff="Gill Sans" h="100%">
      <Text size="xl" p="0.5rem" fw="700">Walking in Barcelona</Text>
      <Text size="lg">Completed: 45.61% | Walked: 1558km</Text>
    </Flex>
  )
}

export default Header
