import {CartoLayer, MAP_TYPES} from '@deck.gl/carto';
import Blending from './blending';
import DeferredLoadLayer from './deferredLoadLayer';
import {colorToRGBArray} from '../utils';

let time = 0;
const NORMAL_COLOR = colorToRGBArray('#ffffff');
const HIGHLIGHT_COLOR = colorToRGBArray('#ae0e7f');

const _TruckParkingLayer = DeferredLoadLayer(
  () => {
    const animate = () => {
      time = time + 0.05;
      window.requestAnimationFrame(animate);
    };
    window.requestAnimationFrame(animate);

    function shouldHighlight(coord) {
      return Math.sin(0.1 * time + 0.5 * coord[0]) > 0.95;
    }

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
        let radius = 2;
        if (shouldHighlight(coord)) {
          radius += Math.sin(time + 11324.71 * coord[0] + 26371.44 * coord[1]);
        }
        return radius;
      },
      getFillColor: d => {
        const coord = d.geometry.coordinates;
        return shouldHighlight(coord) ? HIGHLIGHT_COLOR : NORMAL_COLOR;
      },
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
        getPointRadius: [time],
        getFillColor: [time]
      }
    };
  }
);

export const TruckParkingLayer = new _TruckParkingLayer({
  id: 'truck-parking'
});
