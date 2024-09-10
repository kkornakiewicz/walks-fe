import React, { useState, useEffect } from "react"
import { createRoot } from "react-dom/client"
import {
  Map,
  NavigationControl,
  Popup,
  useControl,
} from "react-map-gl/maplibre"

import Header from "./header.jsx"
import { GeoJsonLayer } from "deck.gl"
import { MapboxOverlay as DeckOverlay } from "@deck.gl/mapbox"
import "maplibre-gl/dist/maplibre-gl.css"

const url_edges  =
  "https://raw.githubusercontent.com/kkornakiewicz/walks-fe/main/edges.json"
const url_nodes = "https://raw.githubusercontent.com/kkornakiewicz/walks-fe/main/nodes.json"

const INITIAL_VIEW_STATE = {
  latitude: 41.38685633118305,
  longitude: 2.1696874299405295,
  zoom: 13,
  bearing: 0,
  pitch: 30,
}

const MAP_STYLE =
  "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
function DeckGLOverlay(props) {
  const overlay = useControl(() => new DeckOverlay(props))
  overlay.setProps(props)
  return null
}

function Root() {
  const [selected, setSelected] = useState(null)
  const [edges, setEdges] = useState(null)
  const [nodes, setNodes] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [hovered, setHovered] = useState(null)

  const hover = el => {
    if (el != null) {
      setHovered(el.properties.osmid)
    } else {
      setHovered(null)
    }
  }

  const getEdgeColorByProperty = el => {
    if (el.properties.osmid === hovered) {
      return [112, 41, 99]
    }
    return [250, 128, 114, 140]
  }
  
  const getNodeColorByProperty = el => {
    if (el.properties.visited === true) {
      return [0, 0, 0, 20]
    }
    return [0,0,0,180]
  }

  useEffect(() => {
    // Fetch data when the component loads
    const fetchData = async () => {
      try {
        const response = await fetch(url_edges)
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }
        const jsonData = await response.json() // Use response.text() for non-JSON data
        setEdges(jsonData)
        setLoading(false)
      } catch (error) {
        setError(error.message)
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    // Fetch data when the component loads
    const fetchData = async () => {
      try {
        const response = await fetch(url_nodes)
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }
        const jsonData = await response.json() // Use response.text() for non-JSON data
        setNodes(jsonData)
        console.log(jsonData)
        setLoading(false)
      } catch (error) {
        setError(error.message)
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const layers = [
    new GeoJsonLayer({
      id: "map",
      data: edges,
      pickable: true,
      // Styles
      getLineColor: getEdgeColorByProperty,
      getLineWidth: 8,
      // Interactive props
      autoHighlight: true,
      onClick: info => setSelected(info.object),
      onHover: info => hover(info.object),
      updateTriggers: {
        getLineColor: [hovered],
      },
      beforeId: "watername_ocean", // In interleaved mode, render the layer under map labels
    }),
    new GeoJsonLayer({
      id: "nodes",
      data: nodes,
      // Styles
      getLineColor: getNodeColorByProperty,
      // Interactive props
      autoHighlight: true,
      getLineWidth: 10,
      beforeId: "watername_ocean", // In interleaved mode, render the layer under map labels
    }),
  ]

  return (
    <>
      <Header />
      <Map initialViewState={INITIAL_VIEW_STATE} mapStyle={MAP_STYLE}>
        {selected && (
          <Popup
            key={selected.properties.osmid}
            style={{ zIndex: 10 }} /* position above deck.gl canvas */
            longitude={selected.geometry.coordinates[0][0]}
            latitude={selected.geometry.coordinates[0][1]}
            maxWidth="400px"
          >
            <p>{selected.properties.name}</p>
          </Popup>
        )}
        <DeckGLOverlay layers={layers} /* interleaved */ />
        <NavigationControl position="top-left" />
      </Map>
    </>
  )
}

/* global document */
const container = document.body.appendChild(document.createElement("div"))
createRoot(container).render(<Root />)
