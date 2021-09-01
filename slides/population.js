import {H3HexagonLayer} from '@deck.gl/geo-layers';
import {getPopulationData} from '../datasource';

export const PopulationLayer = new H3HexagonLayer({
  id: 'population-heatmap',
  data: getPopulationData(),
  extruded: true,
  elevationScale: 2,
  getHexagon: d => d.h3,
  getElevation: d => d.pop,
  getFillColor: d => [255, (1 - d.pop / 30000) * 255, 0]
});
