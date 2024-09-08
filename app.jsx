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

const url = "http://ey.mm.st.user.fm/data.json"
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
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hovered, setHovered] = useState(null)

  const hover = el => {
    if (el != null) {
      setHovered(el.properties.osmid)
    } else {
      setHovered(null)
    }
  }

  const getColorByProperty = el => {
    if (el.properties.osmid === hovered) {
      return [112, 41, 99]
    }
    else if (el.properties.visited){
      return [196, 30, 58, 150]
    }
    else {
      return [211,211,211,40]
    }
  }

  
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
      pickable: true,
      // Styles
      getLineColor: getColorByProperty,
      getLineWidth: 8,
      // Interactive props
      autoHighlight: true,
      onClick: info => setSelected(info.object),
      onHover: info => hover(info.object),
      updateTriggers: {
        getLineColor: [hovered],
      }, 
      beforeId: 'watername_ocean' // In interleaved mode, render the layer under map labels
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
