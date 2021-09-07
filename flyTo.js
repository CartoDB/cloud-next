import {Easing, Tween} from '@tweenjs/tween.js';
import {flyToViewport, getFlyToDuration} from '@math.gl/web-mercator';

export default function flyTo(map, position) {
  const opts = {speed: 1.2, curve: 1.414};
  const container = map.getDiv().firstChild;
  const center = map.getCenter();
  let heading = map.getHeading();
  if (position.heading !== undefined) {
    if (position.heading - heading > 180) {
      heading += 360;
    } else if (position.heading - heading < -180) {
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
    longitude: position.lng,
    latitude: position.lat,
    zoom: position.zoom
  };

  let duration = getFlyToDuration(start, end, opts);
  duration = Math.max(1000, Math.min(2000, duration));

  const tween = new Tween({heading, tilt, f: 0})
    .easing(Easing.Quadratic.InOut)
    .duration(duration)
    .to({heading: position.heading, tilt: position.tilt, f: 1})
    .onUpdate(({f, heading, tilt}) => {
      const viewport = flyToViewport(start, end, f, opts);
      map.moveCamera({
        center: {lat: viewport.latitude, lng: viewport.longitude},
        heading,
        tilt,
        zoom: viewport.zoom
      });
    })
    .start();
}

function flyToOld(map, position) {
  const center = map.getCenter();
  let heading = map.getHeading();
  if (position.heading !== undefined) {
    if (position.heading - heading > 180) {
      heading += 360;
    } else if (position.heading - heading < -180) {
      heading -= 360;
    }
  }

  const zoom = map.getZoom();
  let duration = 1000;
  if (position.zoom !== undefined) {
    duration += 100 * Math.abs(position.zoom - zoom);
  }
  const tween = new Tween({
    lat: center.lat(),
    lng: center.lng(),
    heading,
    tilt: map.getTilt(),
    zoom
  })
    .easing(Easing.Quadratic.InOut)
    .duration(duration)
    .to(position)
    .onUpdate(({lat, lng, heading, tilt, zoom}) => {
      map.moveCamera({center: {lat, lng}, heading, tilt, zoom});
    })
    .start();
}
