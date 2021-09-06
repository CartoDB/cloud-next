import Blending from './blending';
import {H3HexagonLayer} from '@deck.gl/geo-layers';
import DeferredLoadLayer from './deferredLoadLayer';
import {getPopulationData} from '../datasource';
import { scaleThreshold } from 'd3-scale';

const colorScaleFunction = scaleThreshold()
  .domain([1, 50, 500, 1000, 12000, 14000])
  .range([
    [253, 230, 219,140],
    [248, 163, 171,140],
    [241, 77, 143,110],
    [182, 0, 119,70],
    [101, 0, 100,80]
]);

const _PopulationLayer = DeferredLoadLayer(() => {
  return new H3HexagonLayer({
    data: getPopulationData(),
    extruded: true,
    filled: true,
    wireframe: false,
    elevationScale: 2.5,
    coverage: 0.9,
    getHexagon: d => d.h3,
    getElevation: d => d.pop,     
    getFillColor: (d) => colorScaleFunction(d.pop),
    parameters: {
      depthTest: false,
      ...Blending.ADDITIVE
    }

  });
});

export const PopulationLayer = new _PopulationLayer({
  id: 'population-heatmap'
});
