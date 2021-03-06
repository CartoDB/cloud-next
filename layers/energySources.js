import {CartoLayer, MAP_TYPES} from '@deck.gl/carto';
import DeferredLoadLayer from './deferredLoadLayer';
import {colorToRGBArray} from '../utils';

const COLOR_ALPHA = 127;
export const COLOR_SCALE = {
  Biomass: colorToRGBArray('#77fb68'),
  ['Hydroelectric dams']: colorToRGBArray('#6ef4fc'),
  ['Wind farms']: colorToRGBArray('#fd1be0'),
  ['Solar farms']: colorToRGBArray('#fbf601'),
  Other: [255, 255, 255]
};

const props = {
  connection: 'bigquery',
  type: MAP_TYPES.TABLE,
  data: 'cartobq.nexus_demo.renewal_plants',
  filled: true,
  stroked: false,
  pointType: 'circle',
  pointRadiusUnits: 'pixels',
  getPointRadius: 10,
  parameters: {
    depthTest: false
  },
  credentials: {
    accessToken:
      'eyJhbGciOiJIUzI1NiJ9.eyJhIjoiYWNfN3hoZnd5bWwiLCJqdGkiOiI2ZGIwYWMzMiJ9.7wkEpcWcazDD1F6Yf72OFcaLvrRJcKpSr1BFB03Suc8'
  }
};

const _EnergySourcesLayer = DeferredLoadLayer(() => {
  return new CartoLayer({
    id: 'energy-sources',
    getFillColor: (d) => {
      const color = COLOR_SCALE[d.properties.type] || COLOR_SCALE.Other;
      return color;
    },
    ...props
  });
});

export const EnergySourcesLayer = new _EnergySourcesLayer({
  id: 'energy-sources'
});

const _EnergySourcesBackgroundLayer = DeferredLoadLayer(() => {
  return new CartoLayer({
    id: 'energy-sources-background',
    opacity: 0.2,
    getFillColor: (d) => {
      const color = COLOR_SCALE[d.properties.type] || COLOR_SCALE.Other;
      return [...color, 1];
    },
    ...props
  });
});

export const EnergySourcesBackgroundLayer = new _EnergySourcesBackgroundLayer({
  id: 'energy-sources-background'
});
