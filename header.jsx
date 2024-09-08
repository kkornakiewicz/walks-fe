import React from "react"
import styled from "styled-components"

// Styled Components
const HeaderBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #282c34;
  color: white;
  padding: 20px;
  height: 40px;
  font-family: "Gill Sans", sans-serif;
`

const Title = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
`

const InfoText = styled.div`
  font-size: 1rem;
  color: #a0a0a0;
`

// Header Component
const Header = () => {
  return (
    <HeaderBar>
      <Title>Walking every street in Barcelona</Title>
      <InfoText>Current progress: 43.41%</InfoText>
    </HeaderBar>
  )
}

export default Header
