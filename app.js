import { Deck } from "@deck.gl/core";
import { GeoJsonLayer } from "@deck.gl/layers";
import { EditableGeoJsonLayer } from "@nebula.gl/layers";
import { DrawPolygonMode } from "@nebula.gl/edit-modes";

const COUNTRIES =
  "https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_50m_admin_0_scale_rank.geojson"; //eslint-disable-line
const AIR_PORTS =
  "https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_10m_airports.geojson";

const INITIAL_VIEW_STATE = {
  latitude: 51.47,
  longitude: 0.45,
  zoom: 4,
  bearing: 0,
  pitch: 0
};

var myFeatureCollection = {
  type: "FeatureCollection",
  features: []
};

function getLayers() {
  const layers = [
    new GeoJsonLayer({
      id: "base-map",
      data: COUNTRIES,
      // Styles
      stroked: true,
      filled: true,
      lineWidthMinPixels: 2,
      opacity: 0.4,
      getLineColor: [60, 60, 60],
      getFillColor: [200, 200, 200]
    }),

    new GeoJsonLayer({
      id: "airports",
      data: AIR_PORTS,
      // Styles
      filled: true,
      pointRadiusMinPixels: 2,
      pointRadiusScale: 2000,
      getRadius: (f) => 11 - f.properties.scalerank,
      getFillColor: [200, 0, 80, 180],
      // Interactive props
      pickable: true,
      autoHighlight: true,
      onClick: (info) =>
        // eslint-disable-next-line
        info.object &&
        alert(
          `${info.object.properties.name} (${info.object.properties.abbrev})`
        )
    }),

    new EditableGeoJsonLayer({
      id: "nebula",
      data: myFeatureCollection,
      selectedFeatureIndexes: [],
      mode: DrawPolygonMode,

      // Styles
      filled: true,
      pointRadiusMinPixels: 2,
      pointRadiusScale: 2000,
      extruded: true,
      getElevation: 1000,
      getFillColor: [200, 0, 80, 180],

      // Interactive props
      pickable: true,
      autoHighlight: true,

      onEdit: ({ updatedData, editType, featureIndexes, editContext }) => {
        myFeatureCollection = updatedData;
        deck.setProps({ layers: getLayers() });
      }
    })
  ];

  return layers;
}

const layers = getLayers();
const editableGeoJsonLayer = layers[2];

export const deck = new Deck({
  initialViewState: INITIAL_VIEW_STATE,
  // Disable double-click to zoom since that completes the shape
  controller: {
    doubleClickZoom: false
  },
  layers: layers,
  getCursor: editableGeoJsonLayer.getCursor.bind(editableGeoJsonLayer)
});

// For automated test cases
/* global document */
document.body.style.margin = "0px";
