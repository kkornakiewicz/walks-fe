import React, { useState, useEffect } from "react"
import type * as GeoJSON from "geojson"

import "@mantine/core/styles.css"

import { createRoot } from "react-dom/client"
import { Map, Popup, useControl } from "react-map-gl/maplibre"

import Header from "./header.tsx"

import { AppShell, Container } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { MantineProvider, Text } from "@mantine/core"

import { GeoJsonLayer } from "deck.gl"
import { MapboxOverlay, MapboxOverlayProps } from "@deck.gl/mapbox"
import "maplibre-gl/dist/maplibre-gl.css"
import {
	NodeFeature,
	EdgeFeature,
	NodeProperties,
	EdgeProperties,
} from "./types.tsx"
import Menu from "./menu.js"

const url_edges =
	"https://raw.githubusercontent.com/kkornakiewicz/walks-fe/main/edges.json"
const url_nodes =
	"https://raw.githubusercontent.com/kkornakiewicz/walks-fe/main/nodes.json"

const INITIAL_VIEW_STATE = {
	latitude: 41.38685633118305,
	longitude: 2.1696874299405295,
	zoom: 13,
	bearing: 0,
	pitch: 30,
}

const MAP_STYLE = "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"

function DeckGLOverlay(props: MapboxOverlayProps) {
	const overlay = useControl(() => new MapboxOverlay(props))
	overlay.setProps(props)
	return null
}

function Root() {
	const [opened, { toggle, open, close }] = useDisclosure(false)
	const [showStreets, setShowStreets] = useState(true)
	const [showNodes, setShowNodes] = useState(false)

	const [selectedEdge, setSelectedEdge] = useState<EdgeFeature | null>(null)
	const [edges, setEdges] = useState<GeoJSON.FeatureCollection<
		GeoJSON.LineString,
		EdgeProperties
	> | null>(null)
	const [nodes, setNodes] = useState<GeoJSON.FeatureCollection<
		GeoJSON.Point,
		NodeProperties
	> | null>(null)
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

	const getEdgeColorByProperty = (el: EdgeFeature) => {
		if (el.properties.osmid === hovered) {
			return [112, 41, 99]
		}
		if (el.properties.visited === true) return [250, 128, 114, 140]
		else {
			return [250, 128, 114, 10]
		}
	}

	const getNodeColorByProperty = (el: NodeFeature) => {
		if (el.properties.visited === true) {
			return [0, 0, 0, 20]
		}
		return [0, 0, 0, 180]
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
			// Styles
			getLineColor: getEdgeColorByProperty,
			getLineWidth: 8,
			// Interactive props
			autoHighlight: true,
			pickable: true,
			onClick: info => setSelectedEdge(info.object),
			onHover: info => hover(info.object),
			updateTriggers: {
				getLineColor: [hovered],
			},
			beforeId: "watername_ocean", // In interleaved mode, render the layer under map labels
			visible: showStreets,
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
			visible: showNodes
		}),
	]

	return (
		<MantineProvider>
			<AppShell header={{ height: 60 }}>
				<AppShell.Header withBorder={false}>
					<Header opened={opened} toggle={toggle} />
				</AppShell.Header>

				<AppShell.Main>
					<Menu
						opened={opened}
						close={close}
						open={open}
						showStreets={showStreets}
						setShowStreets={setShowStreets}
						showNodes={showNodes}
						setShowNodes={setShowNodes}
					/>
					<Container h="100vh" fluid w="100%" p="0">
						<Map initialViewState={INITIAL_VIEW_STATE} mapStyle={MAP_STYLE}>
							{selectedEdge && (
								<Popup
									key={selectedEdge.properties.osmid}
									style={{ zIndex: 10 }} /* position above deck.gl canvas */
									longitude={selectedEdge.geometry.coordinates[0][0]}
									latitude={selectedEdge.geometry.coordinates[0][1]}
									maxWidth="60em"
								>
									<Text>{selectedEdge.properties.name}</Text>
								</Popup>
							)}
							<DeckGLOverlay
								layers={layers}
								/* interleaved */ useDevicePixels={false}
							/>
						</Map>
					</Container>
				</AppShell.Main>
			</AppShell>
		</MantineProvider>
	)
}

/* global document */
const container = document.body.appendChild(document.createElement("div"))
createRoot(container).render(<Root />)
