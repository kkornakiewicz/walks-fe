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
import Header from "./header.jsx"

const url = 'https://raw.githubusercontent.com/kkornakiewicz/walks-fe/main/data.json'

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

const getColorByProperty = el => {
    if (el.properties.visited) {
      return [250, 128, 114, 140]
    } else return [242, 243, 244]
  }

function Root() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    // Fetch data when the component loads
    const fetchData = async () => {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const jsonData = await response.json(); // Use response.text() for non-JSON data
        setData(jsonData);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []); 


  const layers = [
    new GeoJsonLayer({
      id: "map",
      data: data,
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
      <Header />
      <Map initialViewState={INITIAL_VIEW_STATE} mapStyle={MAP_STYLE}>
        <DeckGLOverlay layers={layers} overlaid/>
      </Map>
    </>
  )
}

/* global document */
const container = document.body.appendChild(document.createElement("div"))
createRoot(container).render(<Root />)
