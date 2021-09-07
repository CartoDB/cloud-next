import {CartoLayer, MAP_TYPES} from '@deck.gl/carto';
import Blending from './blending';
import DeferredLoadLayer from './deferredLoadLayer';

const _PowerLinesLayer = DeferredLoadLayer(() => {
  return new CartoLayer({
    id: 'power-lines',
    connection: 'bigquery',
    type: MAP_TYPES.TILESET,
    data: 'cartobq.nexus_demo.transmission_lines_tileset',
    getLineColor: [83, 135, 185, 180],
    filled: false,
    stroked: true,
    lineWidthMinPixels: 1,
    credentials: {
      accessToken:
        'eyJhbGciOiJIUzI1NiJ9.eyJhIjoiYWNfN3hoZnd5bWwiLCJqdGkiOiIxMWYzY2ZmYiJ9.y7ofb0sjK3M_rfE4qm2MT73jH0J9zekMnkCj88EmSqU'
    },
    parameters: {
      depthTest: false,
      ...Blending.ADDITIVE
    }
  });
});

export const PowerLinesLayer = new _PowerLinesLayer({
  id: 'power-lines'
});
