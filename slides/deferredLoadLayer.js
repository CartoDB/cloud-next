import {CompositeLayer} from '@deck.gl/core';

// Utility to create a layer that only is initialized
// (and thus data loaded) once visible
export default function DeferredLoadLayer(createLayer) {
  return class DeferredLoadLayer extends CompositeLayer {
    renderLayers() {
      const {visible} = this.props;
      const subLayers = this.getSubLayers();
      if (subLayers.length !== 0) {
        // Return cached sublayers to avoid re-fetching data
        return subLayers.map(l => l.clone({visible}));
      }

      // Only create sublayer lazily if visible
      if (!visible) {
        return [];
      }
      const subLayer = createLayer().clone({
        id: `deferred-${this.id}`
      });
      return [subLayer];
    }
  };
}
