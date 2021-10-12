import {BitmapLayer} from '@deck.gl/layers';
import {CartoLayer, MAP_TYPES} from '@deck.gl/carto';
import {TileLayer} from '@deck.gl/geo-layers';
import Blending from './blending';
import DeferredLoadLayer from './deferredLoadLayer';

const mobile = true;
const _PowerLinesLayer = DeferredLoadLayer(() => {
  return mobile
    ? new TileLayer({
        data: 'transmission/{z}/{x}/{y}.png',
        minZoom: 1,
        maxZoom: 5,
        tileSize: 512,
        zoomOffset: 1,
        parameters: {
          ...Blending.ADDITIVE
        },

        renderSubLayers: props => {
          const {
            bbox: {west, south, east, north}
          } = props.tile;

          return new BitmapLayer(props, {
            data: null,
            image: props.data,
            bounds: [west, south, east, north]
          });
        }
      })
    : new CartoLayer({
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
            'eyJhbGciOiJIUzI1NiJ9.eyJhIjoiYWNfN3hoZnd5bWwiLCJqdGkiOiJjOTVkODFlZCJ9.6T9_NBCsS5t-MJXDHLLkSSRmh6Pyqrutr9NbdrL5YN8'
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
