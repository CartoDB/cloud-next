import {CartoLayer, MAP_TYPES} from '@deck.gl/carto';
export const TexasBoundaryLayer = new CartoLayer({
  id: 'texas-boundary-layer',
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
