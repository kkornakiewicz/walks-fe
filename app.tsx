import React, { useState, useEffect } from "react"
import type * as GeoJSON from "geojson"

import "@mantine/core/styles.css"

import styled from "styled-components"
import { createRoot } from "react-dom/client"
import {
	Map,
	NavigationControl,
	Popup,
	useControl,
} from "react-map-gl/maplibre"

import Header from "./header.tsx"
import Loading from "./loading.tsx"

import {
	AppShell,
	AspectRatio,
	Burger,
	Container,
	Skeleton,
} from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { MantineProvider } from "@mantine/core"

import { GeoJsonLayer } from "deck.gl"
import { MapboxOverlay, MapboxOverlayProps } from "@deck.gl/mapbox"
import "maplibre-gl/dist/maplibre-gl.css"
import {
	NodeFeature,
	EdgeFeature,
	NodeProperties,
	EdgeProperties,
} from "./types.tsx"

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

const PopupContent = styled.div`
	font-size: 2vw;
	padding: 0.2em 1em;
	line-height: 1.2em;
	font-family: "Gill Sans", sans-serif;
`

const MAP_STYLE = "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"

function DeckGLOverlay(props: MapboxOverlayProps) {
	const overlay = useControl(() => new MapboxOverlay(props))
	overlay.setProps(props)
	return null
}

function Root() {
	const [opened, { toggle }] = useDisclosure(false)

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
		<MantineProvider>
			<AppShell header={{ height: 60 }} padding="md">
				<AppShell.Header withBorder={false}>
					<Header />
				</AppShell.Header>

				<AppShell.Main>
					<Container h="85vh" fluid>
						<Map initialViewState={INITIAL_VIEW_STATE} mapStyle={MAP_STYLE}>
							{selectedEdge && (
								<Popup
									key={selectedEdge.properties.osmid}
									style={{ zIndex: 10 }} /* position above deck.gl canvas */
									longitude={selectedEdge.geometry.coordinates[0][0]}
									latitude={selectedEdge.geometry.coordinates[0][1]}
									maxWidth="60em"
								>
									<PopupContent>{selectedEdge.properties.name}</PopupContent>
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
