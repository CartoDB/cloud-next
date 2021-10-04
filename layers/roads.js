import Blending from './blending';
import {GeoJsonLayer} from '@deck.gl/layers';
import DeferredLoadLayer from './deferredLoadLayer';
import {getWKTData} from '../datasource';
import {colorToRGBArray} from '../utils';

const _RoadsLayer = DeferredLoadLayer(() => {
  return new GeoJsonLayer({
    id: 'roads',
    data: getWKTData('cartobq.nexus_demo.na_roads_simplified', {
      credentials: {
        accessToken:
          'eyJhbGciOiJIUzI1NiJ9.eyJhIjoiYWNfN3hoZnd5bWwiLCJqdGkiOiI4ZTcwMzZmNiJ9.t4I6xKL-3mpgbtRzTjMEV8LWEEGIZR7-sTA_YkI0Y5g'
      }
    }),
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
