import {ScenegraphLayer} from '@deck.gl/mesh-layers';
import DeferredLoadLayer from './deferredLoadLayer';
import {getSingleTripData} from '../datasource';
import {headingBetweenPoints} from '../utils';

let time = 0;
let data = null;
let map = null;
export const setMap = m => {
  map = m;
};

const _SingleTruckLayer = DeferredLoadLayer(
  () => {
    const animate = () => {
      time = (time + 1) % 2800;
      window.requestAnimationFrame(animate);
    };
    window.requestAnimationFrame(animate);
    data = getSingleTripData();

    return new ScenegraphLayer({
      data,
      pickable: true,
      opacity: 1,
      sizeScale: 10,
      scenegraph: 'low_poly_truck/scene.gltf',
      getPosition: d => getVehiclePosition(d, time),
      getOrientation: d => [0, 180 - getVehicleHeading(d, time), 90],
      _lighting: 'pbr'
    });
  },
  ({props, layer}) => {
    if (layer?.props?.visible) {
      const trip = data[0];
      const [lng, lat] = getVehiclePosition(trip, time);
      map.moveCamera({center: {lng, lat}, zoom: 18, heading: 0.2 * time, tilt: 45});
    }
    return {
      ...props,
      updateTriggers: {
        getPosition: [time],
        getOrientation: [time]
      }
    };
  }
);

export const SingleTruckLayer = new _SingleTruckLayer({
  id: 'single-truck'
});

function getVehiclePosition(trip, time) {
  const start = trip.timestamps[0];
  const end = trip.timestamps[trip.timestamps - 1];
  if (time < start || time > end) {
    return trip.path[0];
  }
  for (let i = 0; i < trip.timestamps.length; i++) {
    const t1 = trip.timestamps[i];
    const t2 = trip.timestamps[i + 1];
    if (time > t1 && time < t2) {
      const f = (time - t1) / (t2 - t1);
      const p1 = trip.path[i];
      const p2 = trip.path[i + 1];
      const lng = p1[0] * (1 - f) + p2[0] * f;
      const lat = p1[1] * (1 - f) + p2[1] * f;
      return [lng, lat];
    }
  }

  return trip.path[0];
}

function getVehicleHeading(trip, time) {
  const start = trip.timestamps[0];
  const end = trip.timestamps[trip.timestamps - 1];
  if (time < start || time > end) {
    return headingBetweenPoints(trip.path[0], trip.path[1]);
  }
  for (let i = 0; i < trip.timestamps.length; i++) {
    const t1 = trip.timestamps[i];
    const t2 = trip.timestamps[i + 1];
    if (time > t1 && time < t2) {
      const p1 = trip.path[i];
      const p2 = trip.path[i + 1];
      return headingBetweenPoints(p1, p2);
    }
  }

  return 0;
}
