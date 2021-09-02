import {H3HexagonLayer} from '@deck.gl/geo-layers';
import DeferredLoadLayer from './deferredLoadLayer';
import {getPopulationData} from '../datasource';

const _PopulationLayer = DeferredLoadLayer(() => {
  return new H3HexagonLayer({
    data: getPopulationData(),
    extruded: true,
    elevationScale: 2,
    getHexagon: d => d.h3,
    getElevation: d => d.pop,
    getFillColor: d => [255, (1 - d.pop / 30000) * 255, 0]
  });
});

export const PopulationLayer = new _PopulationLayer({
  id: 'population-heatmap'
});
