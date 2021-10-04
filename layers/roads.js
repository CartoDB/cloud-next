import Blending from './blending';
import {CartoLayer, MAP_TYPES} from '@deck.gl/carto';
import DeferredLoadLayer from './deferredLoadLayer';
import {colorToRGBArray} from '../utils';

const _RoadsLayer = DeferredLoadLayer(() => {
  return new CartoLayer({
    id: 'roads',
    connection: 'bigquery',
    type: MAP_TYPES.TABLE,
    data: 'cartobq.nexus_demo.na_roads_simplified',
    getLineColor: [224, 222, 97, 65],
    filled: false,
    stroked: true,
    lineWidthMinPixels: 1,
    credentials: {
      accessToken:
        'eyJhbGciOiJIUzI1NiJ9.eyJhIjoiYWNfN3hoZnd5bWwiLCJqdGkiOiI4ZTcwMzZmNiJ9.t4I6xKL-3mpgbtRzTjMEV8LWEEGIZR7-sTA_YkI0Y5g'
    },
    parameters: {
      depthTest: false,
      ...Blending.ADDITIVE
    }
  });
});

export const RoadsLayer = new _RoadsLayer({
  id: 'roads'
});
