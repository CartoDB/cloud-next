import {CartoLayer, MAP_TYPES} from '@deck.gl/carto';
import Blending from './blending';
import DeferredLoadLayer from './deferredLoadLayer';

const _PowerLinesLayer = DeferredLoadLayer(() => {
  return new CartoLayer({
    id: 'power-lines',
    connection: 'bigquery',
    type: MAP_TYPES.TILESET,
    data: 'cartobq.nexus_demo.transmission_lines_tileset_simplified',
    getLineColor: [83, 135, 185, 180],
    filled: false,
    stroked: true,
    lineWidthMinPixels: 1,
    credentials: {
      accessToken:
        'YOUR_CARTO_ACCESS_TOKEN'
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
