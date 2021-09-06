import {CartoLayer, MAP_TYPES} from '@deck.gl/carto';
import Blending from './blending';
import DeferredLoadLayer from './deferredLoadLayer';
import {colorToRGBArray} from '../utils';

const props = {};

const _TruckParkingLayer = DeferredLoadLayer(() => {
  return new CartoLayer({
    connection: 'bigquery',
    type: MAP_TYPES.TABLE,
    data: 'cartobq.nexus_demo.truck_parking_locations2',
    filled: true,
    stroked: false,
    pointType: 'circle',
    pointRadiusUnits: 'pixels',
    getPointRadius: 5,
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
});

export const TruckParkingLayer = new _TruckParkingLayer({
  id: 'truck-parking'
});
