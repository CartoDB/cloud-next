import {BitmapLayer} from '@deck.gl/layers';
import {CartoLayer, MAP_TYPES} from '@deck.gl/carto';
import {TileLayer} from '@deck.gl/geo-layers';
import Blending from './blending';
import DeferredLoadLayer from './deferredLoadLayer';
import {colorToRGBArray} from '../utils';

const mobile = true;
const _RoadsLayer = DeferredLoadLayer(() => {
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
