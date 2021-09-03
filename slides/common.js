import {CartoLayer, MAP_TYPES} from '@deck.gl/carto';
import {GeoJsonLayer} from '@deck.gl/layers';
import DeferredLoadLayer from './deferredLoadLayer';
import {getWKTData} from '../datasource';
import {colorToRGBArray} from '../utils';

const boundaryProps = {
  connection: 'bigquery',
  type: MAP_TYPES.TABLE,
  data: 'cartobq.nexus_demo.texas_boundary_simplified',
  filled: false,
  stroked: true,
  credentials: {
    accessToken:
      'eyJhbGciOiJIUzI1NiJ9.eyJhIjoiYWNfN3hoZnd5bWwiLCJqdGkiOiIzYWZhODUyOSJ9.bCrMmLKkMAgA21Y14js5up8CR4IJ45xhENzXo-CuHMs'
  }
};

const _TexasThinBoundaryLayer = DeferredLoadLayer(() => {
  return new CartoLayer({
    getLineColor: colorToRGBArray('#5380b5'),
    lineWidthMinPixels: 1,
    ...boundaryProps
  });
});

export const TexasThinBoundaryLayer = new _TexasThinBoundaryLayer({
  id: 'texas-thin-boundary'
});

const _TexasBoundaryLayer = DeferredLoadLayer(() => {
  return new CartoLayer({
    getLineColor: colorToRGBArray('#e8fc0c'),
    lineWidthMinPixels: 5,
    ...boundaryProps
  });
});
export const TexasBoundaryLayer = new _TexasBoundaryLayer({
  id: 'texas-boundary'
});

const _TexasCountiesLayer = DeferredLoadLayer(() => {
  return new GeoJsonLayer({
    id: 'texas-counties',
    data: getWKTData('cartobq.nexus_demo.texas_counties'),
    stroked: true,
    filled: false,
    lineWidthMinPixels: 2,
    getLineColor: [233, 244, 0, 80],
    credentials: {
      accessToken:
        'eyJhbGciOiJIUzI1NiJ9.eyJhIjoiYWNfN3hoZnd5bWwiLCJqdGkiOiJjZTY5M2NmMCJ9.9HD7U1c-Wh81SPaSvWWSNShF7MIMH-9-S8YmWFo0_x0'
    }
  });
});

export const TexasCountiesLayer = new _TexasCountiesLayer({
  id: 'texas-counties'
});
