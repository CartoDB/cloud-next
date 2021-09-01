import {GoogleMapsOverlay as DeckOverlay} from '@deck.gl/google-maps';
import FlowmapLayer from './flowmap';
import {H3HexagonLayer, TripsLayer} from '@deck.gl/geo-layers';
import {GeoJsonLayer} from '@deck.gl/layers';
import {ScenegraphLayer} from '@deck.gl/mesh-layers';
import {HexagonLayer} from '@deck.gl/aggregation-layers';
import {registerLoaders} from '@loaders.gl/core';
import {CSVLoader} from '@loaders.gl/csv';
import {GLTFLoader} from '@loaders.gl/gltf';
import {update as updateTween} from '@tweenjs/tween.js';

import {headingBetweenPoints} from './utils';
import {flows, locations} from './data/od_texas';
import flowmapStyle from './flowmapStyle';

import {TexasBoundaryLayer, TexasCountiesLayer} from './slides/common';
import {PopulationLayer} from './slides/population';
import {PowerLinesLayer} from './slides/powerLines';
import {EnergySourcesLayer} from './slides/energySources';

registerLoaders([CSVLoader, GLTFLoader]);

const LOOP_LENGTH = 1800;
const THEME = {
  trailColor0: [255, 0, 0],
  trailColor1: [0, 0, 255]
};

export function createOverlay(map) {
  let currentTime = 0;
  const props = {
    id: 'trips',
    data: [],
    getPath: d => d.path,
    getTimestamps: d => d.timestamps,
    getColor: d => (d.vendor === 0 ? THEME.trailColor0 : THEME.trailColor1),
    opacity: 1,
    widthMinPixels: 2,
    rounded: true,
    trailLength: 180,
    currentTime,
    shadowEnabled: false
  };

  const scenegraphProps = {
    id: 'scenegraph-layer',
    data: [],
    pickable: true,
    opacity: 1,
    sizeScale: 10,
    scenegraph: 'low_poly_truck/scene.gltf',
    getPosition: d => getVehiclePosition(d, currentTime),
    getOrientation: d => [0, 180 - getVehicleHeading(d, currentTime), 90],
    _lighting: 'pbr'
  };

  const scatterProps = {
    data: locations,
    getPosition: d => [d.lon, d.lat],
    getFillColor: [33, 45, 211],
    getLineColor: [33, 33, 33],
    radiusMinPixels: 6,
    lineWidthMinPixels: 2
  };

  const flowmapProps = {
    id: 'flowmap-layer',
    locations,
    flows,
    ...flowmapStyle,
    getFlowMagnitude: flow => flow.count || 0,
    getFlowOriginId: flow => flow.origin,
    getFlowDestId: flow => flow.dest,
    getLocationId: loc => loc.id,
    getLocationCentroid: loc => [loc.lon, loc.lat]
  };

  const COLOR_RANGE = [
    [1, 152, 189],
    [73, 227, 206],
    [216, 254, 181],
    [254, 237, 177],
    [254, 173, 84],
    [209, 55, 78]
  ];

  const overlay = new DeckOverlay({});
  overlay.truckToFollow = null;
  overlay.visibleLayers = [];
  const animate = () => {
    currentTime = (currentTime + 0.1) % LOOP_LENGTH;
    const tripsLayer = new TripsLayer({
      ...props,
      currentTime
    });
    const scenegraphLayer = new ScenegraphLayer({
      updateTriggers: {
        getPosition: [currentTime],
        getOrientation: [currentTime]
      },
      ...scenegraphProps
    });
    const flowmapLayer = new FlowmapLayer(flowmapProps);

    overlay.setProps({
      layers: [
        flowmapLayer.clone({
          animationCurrentTime: 10 * currentTime
        }),
        PopulationLayer,
        TexasCountiesLayer,
        TexasBoundaryLayer,
        PowerLinesLayer,
        EnergySourcesLayer.clone({
          pointRadiusScale: 0.6 + 0.4 * Math.sin(0.4 * currentTime)
        })
      ].map(l => {
        const visible = overlay.visibleLayers.indexOf(l.id) !== -1;
        return l.clone({visible});
      })
    });
    updateTween();
    if (overlay.truckToFollow !== null) {
      const trip = data[overlay.truckToFollow];
      const [lng, lat] = getVehiclePosition(trip, currentTime);
      map.moveCamera({center: {lng, lat}, zoom: 18, heading: currentTime, tilt: 45});
    }

    window.requestAnimationFrame(animate);
  };
  window.requestAnimationFrame(animate);

  overlay.setMap(map);

  return overlay;
}

function getVehiclePosition(trip, time) {
  const start = trip.timestamps[0];
  const end = trip.timestamps[trip.timestamps - 1];
  if (time < start || time > end) {
    return trip.path[0];
  }
  for (let i = 0; i < trip.timestamps.length; i++) {
    const t1 = trip.timestamps[i];
    const t2 = trip.timestamps[i + 1];
    if (time > t1 && time < t2) {
      const f = (time - t1) / (t2 - t1);
      const p1 = trip.path[i];
      const p2 = trip.path[i + 1];
      const lng = p1[0] * (1 - f) + p2[0] * f;
      const lat = p1[1] * (1 - f) + p2[1] * f;
      return [lng, lat];
    }
  }

  return trip.path[0];
}

function getVehicleHeading(trip, time) {
  const start = trip.timestamps[0];
  const end = trip.timestamps[trip.timestamps - 1];
  if (time < start || time > end) {
    return headingBetweenPoints(trip.path[0], trip.path[1]);
  }
  for (let i = 0; i < trip.timestamps.length; i++) {
    const t1 = trip.timestamps[i];
    const t2 = trip.timestamps[i + 1];
    if (time > t1 && time < t2) {
      const p1 = trip.path[i];
      const p2 = trip.path[i + 1];
      return headingBetweenPoints(p1, p2);
    }
  }

  return 0;
}
