import React, { useState, useEffect } from "react"
import styled from "styled-components"

const Overlay = styled.div<{ isVisible: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent background */
  display: ${({ isVisible }) => (isVisible ? "flex" : "none")};
  justify-content: center;
  align-items: center;
  z-index: 9999; /* High z-index to ensure it appears on top */
`

const LoadingText = styled.div`
  color: white;
  font-size: 24px;
  font-weight: bold;
  font-family: "Gill Sans", sans-serif;
`

const Loading = (props: {isLoading: boolean}) => {
  return (
    <>
      <Overlay isVisible={props.isLoading}>
        <LoadingText>Loading...</LoadingText>
      </Overlay>
    </>
  )
}

export default Loading
