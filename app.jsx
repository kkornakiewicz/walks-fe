import React, { useState, useEffect } from "react"
import { createRoot } from "react-dom/client"
import {
  Map,
  NavigationControl,
  Popup,
  useControl,
} from "react-map-gl/maplibre"
import { GeoJsonLayer, ArcLayer } from "deck.gl"
import { MapboxOverlay as DeckOverlay } from "@deck.gl/mapbox"
import "maplibre-gl/dist/maplibre-gl.css"
import edges_data from "./data.json"
import Header from "./header.jsx"

const INITIAL_VIEW_STATE = {
  latitude: 41.4,
  longitude: 2.17,
  zoom: 12,
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
  const getColorByProperty = el => {
    if (el.properties.visited) {
      return [250, 128, 114, 140]
    } else return [242, 243, 244]
  }

  const layers = [
    new GeoJsonLayer({
      id: "map",
      data: edges_data,
      // Styles
      filled: true,
      pointRadiusMinPixels: 2,
      pointRadiusScale: 2000,
      getFillColor: [200, 0, 80, 180],
      getLineColor: getColorByProperty,
      getLineWidth: 8,
      // Interactive props
      autoHighlight: true,
      // beforeId: 'watername_ocean' // In interleaved mode, render the layer under map labels
    }),
  ]

  return (
    <>
    <Header/>
      <Map initialViewState={INITIAL_VIEW_STATE} mapStyle={MAP_STYLE}>
        <DeckGLOverlay layers={layers} /* interleaved*/ />
      </Map>
    </>
  )
}

/* global document */
const container = document.body.appendChild(document.createElement("div"))
createRoot(container).render(<Root />)
