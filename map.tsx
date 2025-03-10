import "@mantine/core/styles.css"
import "maplibre-gl/dist/maplibre-gl.css"

import { MapboxOverlay, MapboxOverlayProps } from "@deck.gl/mapbox"
import { Text } from "@mantine/core"
import { Color, GeoJsonLayer, MapViewState } from "deck.gl"
import type * as GeoJSON from "geojson"
import React, { useEffect, useState } from "react"
import { Map as MapLibre, Popup, useControl } from "react-map-gl/maplibre"

import {
  EdgeFeature,
  EdgeProperties,
  MapSettings,
  NodeFeature,
  NodeProperties,
} from "./types"

const BASE_URL =
  "https://raw.githubusercontent.com/kkornakiewicz/walks-fe/main/data"
const edgesUrl = `${BASE_URL}/edges.json`
const nodesUrl = `${BASE_URL}/nodes.json`

const MAP_STYLE =
  "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"

function DeckGLOverlay(props: MapboxOverlayProps) {
  const overlay = useControl(() => new MapboxOverlay(props))
  overlay.setProps(props)
  return null
}

const Map = (props: {
  mapSettings: MapSettings
  currentLocation: [number, number] | null
  viewState: MapViewState
  setViewState: (viewState: MapViewState) => void
}) => {
  const { showStreets, showNodes, showCurrentLocation } = props.mapSettings
  const [selectedEdge, setSelectedEdge] = useState<EdgeFeature | null>(null)
  const [edges, setEdges] = useState<GeoJSON.FeatureCollection<
    GeoJSON.LineString,
    EdgeProperties
  > | null>(null)
  const [nodes, setNodes] = useState<GeoJSON.FeatureCollection<
    GeoJSON.Point,
    NodeProperties
  > | null>(null)
  const [_loading, setLoading] = useState(true)
  const [_error, setError] = useState<string | null>(null)
  const [hovered, setHovered] = useState<number | undefined>(undefined)

  const hover = (el: EdgeFeature) => {
    if (el != null) {
      setHovered(el.properties.osmid)
    } else {
      setHovered(undefined)
    }
  }

  const HOVERED_EDGE_COLOR: Color = [224, 49, 49, 240]
  const VISITED_EDGE_COLOR: Color = [0, 47, 167, 140]
  const UNVISITED_EDGE_COLOR: Color = [0, 47, 167, 10]
  const VISITED_NODE_COLOR: Color = [0, 0, 0, 20]
  const UNVISITED_NODE_COLOR: Color = [0, 0, 0, 180]
  const CURRENT_LOCATION_COLOR: Color = [210, 31, 60, 200]

  const getEdgeColorByProperty = (el: EdgeFeature): Color => {
    if (el.properties.osmid === hovered) {
      return HOVERED_EDGE_COLOR
    }
    return el.properties.visited ? VISITED_EDGE_COLOR : UNVISITED_EDGE_COLOR
  }

  const getNodeColorByProperty = (el: NodeFeature): Color => {
    return el.properties.visited ? VISITED_NODE_COLOR : UNVISITED_NODE_COLOR
  }

  const fetchData = async () => {
    try {
      const [edgesResponse, nodesResponse] = await Promise.all([
        fetch(edgesUrl),
        fetch(nodesUrl),
      ])

      if (!edgesResponse.ok || !nodesResponse.ok) {
        throw new Error(
          `HTTP error! Status: ${edgesResponse.status} ${nodesResponse.status}`,
        )
      }

      const [edgesData, nodesData] = await Promise.all([
        edgesResponse.json(),
        nodesResponse.json(),
      ])

      setEdges(edgesData)
      setNodes(nodesData)
      setLoading(false)
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError("An unknown error occurred")
      }
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const layers = [
    new GeoJsonLayer({
      id: "map",
      data: edges || [],
      // Styles
      getLineColor: el => getEdgeColorByProperty(el as EdgeFeature),
      getLineWidth: 8,

      // Interactive props
      autoHighlight: true,
      pickable: true,
      onClick: info => setSelectedEdge(info.object),
      onHover: info => hover(info.object),
      updateTriggers: {
        getLineColor: [hovered],
      },
      visible: showStreets,
    }),
    new GeoJsonLayer({
      id: "nodes",
      data: nodes || [],
      // Styles
      getLineColor: el => getNodeColorByProperty(el as NodeFeature),
      getFillColor: el => getNodeColorByProperty(el as NodeFeature),
      getPointRadius: 5,
      // Interactive props
      autoHighlight: true,
      visible: showNodes,
    }),
    new GeoJsonLayer({
      id: "current-location",
      data: {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: props.currentLocation || [0, 0],
            },
            properties: {},
          },
        ],
      },
      getFillColor: CURRENT_LOCATION_COLOR,
      getLineColor: CURRENT_LOCATION_COLOR,
      getPointRadius: 25,
      beforeId: "watername_ocean", // In interleaved mode, render the layer under map labels
      visible: showCurrentLocation,
    }),
  ]

  return (
    <MapLibre
      {...props.viewState}
      onMove={evt => props.setViewState(evt.viewState)}
      mapStyle={MAP_STYLE}
    >
      {selectedEdge && (
        <Popup
          key={selectedEdge.properties.osmid}
          style={{ zIndex: 10 }} /* position above deck.gl canvas */
          longitude={selectedEdge.geometry.coordinates[0][0]}
          latitude={selectedEdge.geometry.coordinates[0][1]}
          maxWidth="60em"
        >
          <Text>
            {
              /* Few edges were merged into one during map simplification*/
              Array.isArray(selectedEdge.properties.name)
                ? selectedEdge.properties.name[0]
                : selectedEdge.properties.name
            }
          </Text>
        </Popup>
      )}
      <DeckGLOverlay layers={layers} useDevicePixels={false} />
    </MapLibre>
  )
}

export default Map
