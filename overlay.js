import {GoogleMapsOverlay as DeckOverlay} from '@deck.gl/google-maps';
import {GeoJsonLayer} from '@deck.gl/layers';
import {HexagonLayer} from '@deck.gl/aggregation-layers';
import {registerLoaders} from '@loaders.gl/core';
import {CSVLoader} from '@loaders.gl/csv';
import {GLTFLoader} from '@loaders.gl/gltf';
import {update as updateTween} from '@tweenjs/tween.js';

import {TexasThinBoundaryLayer, TexasBoundaryLayer, TexasCountiesLayer} from './layers/common';
import {RoadsLayer} from './layers/roads';
import {PopulationLayer} from './layers/population';
import {PowerLinesLayer} from './layers/powerLines';
import {EnergySourcesLayer, EnergySourcesBackgroundLayer} from './layers/energySources';
import {TrafficFlowLayer} from './layers/trafficFlow';
import {TruckTripsLayer} from './layers/truckTrips';
import {TemperatureLayer} from './layers/temperature';
import {SingleTruckLayer} from './layers/singleTruck';

registerLoaders([CSVLoader, GLTFLoader]);
const v = 1;
const LOOP_LENGTH = 11 * 3600;

export function createOverlay(map) {
  let currentTime = 0;
  let animationCurrentTime = 0;

  const overlay = new DeckOverlay({});
  overlay.truckToFollow = null;
  overlay.visibleLayers = [];
  const animate = () => {
    currentTime = (currentTime + 50) % LOOP_LENGTH;
    animationCurrentTime = animationCurrentTime + 1;

    overlay.setProps({
      layers: [
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
        TruckTripsLayer.clone({currentTime}),
        SingleTruckLayer.clone({
          updateTriggers: {
            getPosition: [SingleTruckLayer.truckTime],
            getOrientation: [SingleTruckLayer.truckTime]
          }
        })
      ].map(l => {
        const visible = overlay.visibleLayers.indexOf(l.id) !== -1;
        return l.clone({visible});
      })
    });
    updateTween();
    if (overlay.visibleLayers.indexOf('single-truck') !== -1) {
      //const trip = truckData[0];
      //const [lng, lat] = getVehiclePosition(trip, truckTime);
      //map.moveCamera({center: {lng, lat}, zoom: 18, heading: 0.2 * truckTime, tilt: 45});
    }

    window.requestAnimationFrame(animate);
  };
  window.requestAnimationFrame(animate);

  overlay.setMap(map);

  return overlay;
}
