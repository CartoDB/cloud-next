import {TileLayer} from '@deck.gl/geo-layers';
import {BitmapLayer} from '@deck.gl/layers';
import DeferredLoadLayer from './deferredLoadLayer';

const _TemperatureLayer = DeferredLoadLayer(() => {
  return new TileLayer({
    data:
      'https://earthengine.googleapis.com/v1alpha/projects/earthengine-legacy/maps/c7545db6d0a4b91464ec78371eba1b9c-8204799f00ca8f116fbe41ec2f64f12a/tiles/{z}/{x}/{y}',
    minZoom: 0,
    maxZoom: 19,
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
