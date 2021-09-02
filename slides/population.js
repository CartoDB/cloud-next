import {CompositeLayer} from '@deck.gl/core';
import {H3HexagonLayer} from '@deck.gl/geo-layers';
import {getPopulationData} from '../datasource';

function DeferredLoadMixin(createLayer) {
  return class DeferredLoadLayer extends CompositeLayer {
    renderLayers() {
      if (!this.props.visible) {
        return [];
      }

      const subLayer = createLayer().clone({
        id: `deffered-${this.id}`
      });
      return [subLayer];
    }
  };
}

const Layer = DeferredLoadMixin(() => {
  return new H3HexagonLayer({
    data: getPopulationData(),
    extruded: true,
    elevationScale: 2,
    getHexagon: d => d.h3,
    getElevation: d => d.pop,
    getFillColor: d => [255, (1 - d.pop / 30000) * 255, 0]
  });
});

export const PopulationLayer = new Layer({
  id: 'population-heatmap'
});
