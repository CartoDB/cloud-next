import Blending from './blending';
import {TripsLayer} from '@deck.gl/geo-layers';
import DeferredLoadLayer from './deferredLoadLayer';
import {getTripData} from '../datasource';

const _TruckTripsLayer = DeferredLoadLayer(() => {
  return new TripsLayer({
    data: getTripData(),
    getPath: d => d.path,
    getTimestamps: d => d.timestamps,
    getColor: [255, 255, 222],
    opacity: 0.8,
    widthMinPixels: 2,
    rounded: true,
    trailLength: 3600,
    shadowEnabled: false,
    parameters: {
      depthTest: false,
      ...Blending.ADDITIVE
    }
  });
});

export const TruckTripsLayer = new _TruckTripsLayer({
  id: 'truck-trips'
});
