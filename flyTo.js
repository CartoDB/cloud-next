import {Easing, Tween} from '@tweenjs/tween.js';
import {flyToViewport, getFlyToDuration} from '@math.gl/web-mercator';

export default function flyTo(map, view) {
  const opts = {speed: 1.2, curve: 1.414};
  const container = map.getDiv().firstChild;
  const center = map.getCenter();
  let heading = map.getHeading();
  if (view.heading !== undefined) {
    if (view.heading - heading > 180) {
      heading += 360;
    } else if (view.heading - heading < -180) {
      heading -= 360;
    }
  }
  const tilt = map.getTilt();

  const start = {
    width: container.offsetWidth,
    height: container.offsetHeight,
    longitude: center.lng(),
    latitude: center.lat(),
    zoom: map.getZoom()
  };

  const end = {
    longitude: view.lng,
    latitude: view.lat,
    zoom: view.zoom
  };

  let duration = getFlyToDuration(start, end, opts);
  duration = Math.max(1000, Math.min(2000, duration));

  return new Tween({heading, tilt, f: 0})
    .easing(Easing.Quadratic.InOut)
    .duration(duration)
    .to({heading: view.heading, tilt: view.tilt, f: 1})
    .onUpdate(({f, heading, tilt}) => {
      const viewport = flyToViewport(start, end, f, opts);
      map.moveCamera({
        center: {lat: viewport.latitude, lng: viewport.longitude},
        heading,
        tilt,
        zoom: viewport.zoom
      });
    });
}
