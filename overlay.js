import {GoogleMapsOverlay as DeckOverlay} from '@deck.gl/google-maps';
import {TripsLayer} from '@deck.gl/geo-layers';
import {ScenegraphLayer} from '@deck.gl/mesh-layers';
import {registerLoaders} from '@loaders.gl/core';
import {GLTFLoader} from '@loaders.gl/gltf';
import {update as updateTween} from '@tweenjs/tween.js';

registerLoaders([GLTFLoader]);

const LOOP_LENGTH = 1800;
const THEME = {
  trailColor0: [255, 0, 0],
  trailColor1: [0, 0, 255]
};

export function createOverlay(map, data) {
  let currentTime = 0;
  const props = {
    id: 'trips',
    data,
    getPath: d => d.path,
    getTimestamps: d => d.timestamps,
    getColor: d => (d.vendor === 0 ? THEME.trailColor0 : THEME.trailColor1),
    opacity: 1,
    widthMinPixels: 2,
    rounded: true,
    trailLength: 180,
    currentTime,
    shadowEnabled: false
  };

  const scenegraphProps = {
    id: 'scenegraph-layer',
    data: [0],
    pickable: true,
    opacity: 1,
    sizeScale: 5,
    scenegraph: 'low_poly_truck/scene.gltf',
    getPosition: [-74, 40.72],
    getOrientation: d => [0, Math.random() * 360, 90],
    _lighting: 'pbr'
  };

  const overlay = new DeckOverlay({});
  const animate = () => {
    currentTime = (currentTime + 1) % LOOP_LENGTH;
    const tripsLayer = new TripsLayer({
      ...props,
      currentTime
    });
    overlay.setProps({
      layers: [tripsLayer, new ScenegraphLayer(scenegraphProps)]
    });
    updateTween();
    if (window.trips) {
      const trip = window.trips[9];
      let center = null;
      for (let i = 0; i < trip.timestamps.length; i++) {
        const t1 = trip.timestamps[i];
        const t2 = trip.timestamps[i + 1];
        if (t1 > currentTime) {
          const f = (currentTime - t1) / (t2 - t1);
          const p1 = trip.path[i];
          const p2 = trip.path[i + 1];
          const lng = p1[0] * (1 - f) + p2[0] * f;
          const lat = p1[1] * (1 - f) + p2[1] * f;
          center = {lat, lng};
          break;
        }
      }
      //map.moveCamera({center});
    }

    window.requestAnimationFrame(animate);
  };
  window.requestAnimationFrame(animate);

  overlay.setMap(map);
}
