import {ScenegraphLayer} from '@deck.gl/mesh-layers';
import {TripsLayer} from '@deck.gl/geo-layers';
import Blending from './blending';
import DeferredLoadLayer from './deferredLoadLayer';
import {getSingleTripData} from '../datasource';
import {headingBetweenPoints} from '../utils';

let time = 0;
let data = getSingleTripData();
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
    let lastHeading = 0;

    return new ScenegraphLayer({
      data,
      pickable: true,
      opacity: 1,
      sizeScale: 10,
      scenegraph: 'low_poly_truck/scene.gltf',
      getPosition: d => getVehiclePosition(d, time),
      getOrientation: d => {
        let heading = 540 - getVehicleHeading(d, time);
        heading = 0.5 * heading + 0.5 * lastHeading;
        lastHeading = heading;
        return [0, heading, 90];
      },
      _lighting: 'pbr'
    });
  },
  ({props, layer}) => {
    if (layer?.props?.visible) {
      const trip = data[0];
      const [lng, lat] = getVehiclePosition(trip, time);
      map.moveCamera({center: {lng, lat}, zoom: 18, heading: (360 / 2800) * time, tilt: 45});
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

const _SingleTruckTrailLayer = DeferredLoadLayer(
  () => {
    return new TripsLayer({
      data,
      getPath: d => d.path,
      getTimestamps: d => d.timestamps,
      getColor: [255, 255, 222],
      opacity: 0.5,
      widthMinPixels: 5,
      rounded: true,
      trailLength: 3600,
      shadowEnabled: false,
      parameters: {
        ...Blending.ADDITIVE
      }
    });
  },
  ({props}) => {
    return {
      currentTime: time,
      ...props
    };
  }
);

export const SingleTruckTrailLayer = new _SingleTruckTrailLayer({
  id: 'single-truck-trail'
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
    if (time > t1 && time <= t2) {
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
    if (time > t1 && time <= t2) {
      const p1 = trip.path[i];
      const p2 = trip.path[i + 1];
      return headingBetweenPoints(p1, p2);
    }
  }

  return 0;
}
