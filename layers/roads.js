import Blending from './blending';
import {CartoLayer, MAP_TYPES} from '@deck.gl/carto';
import DeferredLoadLayer from './deferredLoadLayer';
import {colorToRGBArray} from '../utils';

const _RoadsLayer = DeferredLoadLayer(() => {
  return new CartoLayer({
    id: 'roads',
    connection: 'bigquery',
    type: MAP_TYPES.TILESET,
    data: 'cartobq.nexus_demo.na_roads_tileset',
    getLineColor: colorToRGBArray('#62d2e0'),
    filled: false,
    stroked: true,
    lineWidthMinPixels: 1,
    parameters: {
      depthTest: false,
      ...Blending.ADDITIVE
    },
    credentials: {
      accessToken:
        'eyJhbGciOiJIUzI1NiJ9.eyJhIjoiYWNfN3hoZnd5bWwiLCJqdGkiOiJiNWE4YWVhYSJ9.Q9vJznUdhSZmSEOaGqgYvGy_py-4-svBwOfWElHCXFA'
    }
  });
});

export const RoadsLayer = new _RoadsLayer({
  id: 'roads'
});
