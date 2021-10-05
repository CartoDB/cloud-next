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
        'eyJhbGciOiJIUzI1NiJ9.eyJhIjoiYWNfN3hoZnd5bWwiLCJqdGkiOiJjOGE4M2ZiYyJ9.9MEoA3ohVDrx3RPe7VxoN5bPVoOWB--tMF4D88DwPRQ'
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
