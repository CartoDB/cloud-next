import Blending from './blending';
import {CartoLayer, MAP_TYPES} from '@deck.gl/carto';
import DeferredLoadLayer from './deferredLoadLayer';
import {colorToRGBArray} from '../utils';

const _RoadsLayer = DeferredLoadLayer(() => {
  return new CartoLayer({
    id: 'roads',
    connection: 'bigquery',
    type: MAP_TYPES.TILESET,
    data: 'cartobq.nexus_demo.na_roads_simplified_tileset',
    credentials: {
      accessToken:
        'YOUR_CARTO_ACCESS_TOKEN'
    },
    getLineColor: [224, 222, 97, 65],
    filled: false,
    stroked: true,
    lineWidthMinPixels: 1,
    parameters: {
      depthTest: false,
      ...Blending.ADDITIVE
    }
  });
});

export const RoadsLayer = new _RoadsLayer({
  id: 'roads'
});
