import {CartoLayer, MAP_TYPES} from '@deck.gl/carto';
import Blending from './blending';
import DeferredLoadLayer from './deferredLoadLayer';
import {colorToRGBArray} from '../utils';

let time = 0;

const _TruckParkingLayer = DeferredLoadLayer(
  () => {
    const animate = () => {
      time = time + 0.05;
      window.requestAnimationFrame(animate);
    };
    window.requestAnimationFrame(animate);
    return new CartoLayer({
      connection: 'bigquery',
      type: MAP_TYPES.TABLE,
      data: 'cartobq.nexus_demo.truck_parking_locations2',
      filled: true,
      stroked: false,
      pointType: 'circle',
      pointRadiusUnits: 'pixels',
      getPointRadius: d => {
        const coord = d.geometry.coordinates;
        return 2 + 1 * Math.sin(time + 11324.71 * coord[0] + 26371.44 * coord[1]);
      },
      getFillColor: colorToRGBArray('#ae0e7f'),
      parameters: {
        depthTest: false,
        ...Blending.ADDITIVE
      },
      credentials: {
        accessToken:
          'eyJhbGciOiJIUzI1NiJ9.eyJhIjoiYWNfN3hoZnd5bWwiLCJqdGkiOiJiN2MwNWE3OCJ9.V29mxVZU2Y7SxX1r6vkZkZ57p3XGbWACIuEICimoIiM'
      }
    });
  },
  ({props}) => {
    return {
      ...props,
      updateTriggers: {
        getPointRadius: [time]
      }
    };
  }
);

export const TruckParkingLayer = new _TruckParkingLayer({
  id: 'truck-parking'
});
