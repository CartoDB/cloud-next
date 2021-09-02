import {TripsLayer} from '@deck.gl/geo-layers';
import {getTripData} from '../datasource';

export const TruckTripsLayer = new TripsLayer({
  id: 'truck-trips',
  data: getTripData(),
  getPath: d => d.path,
  getTimestamps: d => d.timestamps,
  getColor: [255, 255, 222],
  opacity: 0.8,
  widthMinPixels: 2,
  rounded: true,
  trailLength: 3600,
  shadowEnabled: false
});
