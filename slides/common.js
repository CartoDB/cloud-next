import {CartoLayer, MAP_TYPES} from '@deck.gl/carto';
import {GeoJsonLayer} from '@deck.gl/layers';
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

export const TexasThinBoundaryLayer = new CartoLayer({
  id: 'texas-thin-boundary',
  getLineColor: colorToRGBArray('#5380b5'),
  lineWidthMinPixels: 1,
  ...boundaryProps
});

export const TexasBoundaryLayer = new CartoLayer({
  id: 'texas-boundary',
  getLineColor: colorToRGBArray('#e8fc0c'),
  lineWidthMinPixels: 10,
  ...boundaryProps
});

export const TexasCountiesLayer = new GeoJsonLayer({
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
