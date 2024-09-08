import React, {useState, useEffect} from 'react';
import {createRoot} from 'react-dom/client';
import {Map, NavigationControl, Popup, useControl} from 'react-map-gl/maplibre';
import {GeoJsonLayer, ArcLayer} from 'deck.gl';
import {MapboxOverlay as DeckOverlay} from '@deck.gl/mapbox';
import 'maplibre-gl/dist/maplibre-gl.css';
import edges_data from "./data.json"

const INITIAL_VIEW_STATE = {
  latitude: 41.4,
  longitude: 2.17,
  zoom: 12,
  bearing: 0,
  pitch: 30
};

const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json';
function DeckGLOverlay(props) {
  const overlay = useControl(() => new DeckOverlay(props));
  overlay.setProps(props);
  return null;
}

function Root() {
  const [selected, setSelected] = useState(null);
  const [hovered, setHovered] = useState(null)

  const hover = (el) => {
    if(el != null){
      setHovered(el)
      console.log(el)
    }
    else {
      setHovered(null)
    }
  }

  useEffect(() => {
        console.log(hovered)
  },
  [hovered])

  const getColorByProperty = (el) => {
    if (hovered != null){
      return [0,0,0]
    }
      return [250, 128, 114, 140]
  }

  const layers = [
    new GeoJsonLayer({
      id: 'map',
      data: edges_data,
      pickable: true,
      // Styles
      getLineColor: getColorByProperty,
      getLineWidth: 8,
      // Interactive props
      onClick: (info) => setSelected(info.object),
      onHover: (info ) => hover(info.object),
      // beforeId: 'watername_ocean' // In interleaved mode, render the layer under map labels
    }),
  ];

  return (
  <>
    <Map initialViewState={INITIAL_VIEW_STATE} mapStyle={MAP_STYLE}>
      {selected && (
        <Popup
          key={selected.properties.osmid}
          style={{zIndex: 10}} /* position above deck.gl canvas */
          longitude={selected.geometry.coordinates[0][0]}
        latitude={selected.geometry.coordinates[0][1]}
        maxWidth="400px"
      >
          <p>
          {selected.properties.name}
          </p>
          <p>
            First visited: DATE
          </p>
        </Popup>
      )}
        <DeckGLOverlay layers={layers} /* interleaved */ />
      <NavigationControl position="top-left" />
    </Map>
  </>
  );
}

/* global document */
const container = document.body.appendChild(document.createElement('div'));
createRoot(container).render(<Root />);
