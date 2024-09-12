import { Flex, Text, Title } from "@mantine/core"
import React from "react"

// Header Component
const Header = () => {
  return (
    <Flex justify="space-between" p="0 2rem" align="center" bg="#282c34" c="white" ff="Gill Sans">
      <Title p="0.5rem" >Walking every street in Barcelona</Title>
      <Text>Completed: 45.61% | Walked: 1558km</Text>
    </Flex>
  )
}

export default Header
