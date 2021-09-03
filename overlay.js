import {GoogleMapsOverlay as DeckOverlay} from '@deck.gl/google-maps';
import {GeoJsonLayer} from '@deck.gl/layers';
import {ScenegraphLayer} from '@deck.gl/mesh-layers';
import {HexagonLayer} from '@deck.gl/aggregation-layers';
import {registerLoaders} from '@loaders.gl/core';
import {CSVLoader} from '@loaders.gl/csv';
import {GLTFLoader} from '@loaders.gl/gltf';
import {update as updateTween} from '@tweenjs/tween.js';

import {headingBetweenPoints} from './utils';

import {TexasThinBoundaryLayer, TexasBoundaryLayer, TexasCountiesLayer} from './layers/common';
import {RoadsLayer} from './layers/roads';
import {PopulationLayer} from './layers/population';
import {PowerLinesLayer} from './layers/powerLines';
import {EnergySourcesLayer, EnergySourcesBackgroundLayer} from './layers/energySources';
import {TrafficFlowLayer} from './layers/trafficFlow';
import {TruckTripsLayer} from './layers/truckTrips';
import {TemperatureLayer} from './layers/temperature';
import {getSingleTripData} from './datasource';

registerLoaders([CSVLoader, GLTFLoader]);

const LOOP_LENGTH = 8 * 3600;

export function createOverlay(map) {
  let currentTime = 0;
  let truckTime = 0;
  let animationCurrentTime = 0;

  const truckData = getSingleTripData();
  const scenegraphProps = {
    id: 'scenegraph-layer',
    data: truckData,
    pickable: true,
    opacity: 1,
    sizeScale: 10,
    scenegraph: 'low_poly_truck/scene.gltf',
    getPosition: d => getVehiclePosition(d, truckTime),
    getOrientation: d => [0, 180 - getVehicleHeading(d, truckTime), 90],
    _lighting: 'pbr'
  };

  const overlay = new DeckOverlay({});
  overlay.truckToFollow = null;
  overlay.visibleLayers = [];
  const animate = () => {
    currentTime = (currentTime + 10) % LOOP_LENGTH;
    truckTime = (truckTime + 1) % 2800;
    animationCurrentTime = animationCurrentTime + 1;
    const scenegraphLayer = new ScenegraphLayer({
      updateTriggers: {
        getPosition: [truckTime],
        getOrientation: [truckTime]
      },
      ...scenegraphProps
    });

    overlay.setProps({
      layers: [
        scenegraphLayer,
        TemperatureLayer,
        RoadsLayer,
        TexasThinBoundaryLayer,
        TrafficFlowLayer.clone({animationCurrentTime}),
        PopulationLayer,
        TexasCountiesLayer,
        TexasBoundaryLayer,
        PowerLinesLayer,
        EnergySourcesBackgroundLayer,
        EnergySourcesLayer.clone({
          pointRadiusScale: 0.4 + 0.4 * Math.sin(0.04 * animationCurrentTime)
        }),
        TruckTripsLayer.clone({currentTime})
      ].map(l => {
        const visible = overlay.visibleLayers.indexOf(l.id) !== -1;
        return l.clone({visible});
      })
    });
    updateTween();
    if (overlay.visibleLayers.indexOf('scenegraph-layer') !== -1) {
      const trip = truckData[0];
      const [lng, lat] = getVehiclePosition(trip, truckTime);
      map.moveCamera({center: {lng, lat}, zoom: 18, heading: 0.2 * truckTime, tilt: 45});
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
