import {CartoLayer, MAP_TYPES} from '@deck.gl/carto';
import {colorToRGBArray} from '../utils';

const COLOR_ALPHA = 127;
const COLOR_SCALE = {
  Biomass: [...colorToRGBArray('#77fb68'), COLOR_ALPHA],
  ['Hydroelectric dams']: [...colorToRGBArray('#6ef4fc'), COLOR_ALPHA],
  ['Wind farms']: [...colorToRGBArray('#fd1be0'), COLOR_ALPHA],
  ['Solar farms']: [...colorToRGBArray('#fbf601'), COLOR_ALPHA],
  Other: [255, 255, 255, COLOR_ALPHA]
};

export const EnergySourcesLayer = new CartoLayer({
  id: 'energy-sources',
  connection: 'bigquery',
  type: MAP_TYPES.TABLE,
  data: 'cartobq.nexus_demo.renewal_plants',
  filled: true,
  stroked: true,
  getFillColor: d => {
    return COLOR_SCALE[d.properties.type] || COLOR_SCALE.Other;
  },
  pointRadiusUnits: 'pixels',
  getPointRadius: 10,
  credentials: {
    accessToken:
      'eyJhbGciOiJIUzI1NiJ9.eyJhIjoiYWNfN3hoZnd5bWwiLCJqdGkiOiI2ZGIwYWMzMiJ9.7wkEpcWcazDD1F6Yf72OFcaLvrRJcKpSr1BFB03Suc8'
  }
});
