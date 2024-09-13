import type * as GeoJSON from "geojson"

export type EdgeProperties = { osmid: number; name: string; visited: boolean }
export type EdgeFeature = GeoJSON.Feature<GeoJSON.LineString, EdgeProperties>

export type NodeProperties = { osmid: number; visited: boolean }
export type NodeFeature = GeoJSON.Feature<GeoJSON.Point, NodeProperties>
