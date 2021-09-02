import {CompositeLayer} from '@deck.gl/core';

// Utility to create a layer that only is initialized
// (and thus data loaded) once visible
export default function DeferredLoadLayer(createLayer) {
  let subLayer = null;
  return class DeferredLoadLayer extends CompositeLayer {
    clone(props) {
      if (subLayer) {
        subLayer = subLayer.clone(props);
      }
      return super.clone(props);
    }

    renderLayers() {
      const {visible, pointRadiusScale} = this.props;

      // Only create sublayer lazily if visible
      if (!visible) {
        return [];
      }
      if (!subLayer) {
        console.log('creating', this.id);
        subLayer = createLayer().clone({
          id: `deferred-${this.id}`
        });
      }
      return [subLayer];
    }
  };
}
