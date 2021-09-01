import {getWKTData} from '../datasource';
import {CartoLayer, MAP_TYPES} from '@deck.gl/carto';
import {GeoJsonLayer} from '@deck.gl/layers';

export const TexasBoundaryLayer = new CartoLayer({
  id: 'texas-boundary',
  connection: 'bigquery',
  type: MAP_TYPES.TABLE,
  data: 'cartobq.nexus_demo.texas_boundary_simplified',
  getLineColor: [235, 252, 12],
  filled: false,
  stroked: true,
  lineWidthMinPixels: 10,
  credentials: {
    accessToken:
      'eyJhbGciOiJIUzI1NiJ9.eyJhIjoiYWNfN3hoZnd5bWwiLCJqdGkiOiIzYWZhODUyOSJ9.bCrMmLKkMAgA21Y14js5up8CR4IJ45xhENzXo-CuHMs'
  }
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
