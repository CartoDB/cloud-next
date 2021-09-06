import {TileLayer} from '@deck.gl/geo-layers';
import {BitmapLayer} from '@deck.gl/layers';
import DeferredLoadLayer from './deferredLoadLayer';

const _TemperatureLayer = DeferredLoadLayer(() => {
  return new TileLayer({
    data:
      'https://storage.googleapis.com/ee_gmaps_demo/{z}_{x}_{y}.png',
    minZoom: 0,
    maxZoom: 8,
    tileSize: 256,

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
  });
});

export const TemperatureLayer = new _TemperatureLayer({
  id: 'temperature'
});
