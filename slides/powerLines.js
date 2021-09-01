import {CartoLayer, MAP_TYPES} from '@deck.gl/carto';

export const PowerLinesLayer = new CartoLayer({
  id: 'power-lines',
  connection: 'bigquery',
  type: MAP_TYPES.TILESET,
  data: 'cartobq.nexus_demo.transmission_lines_tileset',
  getLineColor: [83, 135, 185, 180],
  filled: false,
  stroked: true,
  lineWidthMinPixels: 1,
  credentials: {
    accessToken:
      'eyJhbGciOiJIUzI1NiJ9.eyJhIjoiYWNfN3hoZnd5bWwiLCJqdGkiOiI2ZTk1OTA4YSJ9.jq6Z_q_48PhrebLjGCfbBq8mYQePDc4MOw6wANyzJ-E'
  }
});