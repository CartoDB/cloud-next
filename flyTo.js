import {Easing, Tween} from '@tweenjs/tween.js';
import {flyToViewport, getFlyToDuration} from '@math.gl/web-mercator';

export default function flyTo(map, position) {
  const opts = {speed: 1.2, curve: 1.414};
  const container = map.getDiv().firstChild;
  const center = map.getCenter();

  const start = {
    width: container.offsetWidth,
    height: container.offsetHeight,
    longitude: center.lng(),
    latitude: center.lat(),
    bearing: map.getHeading(),
    pitch: map.getTilt(),
    zoom: map.getZoom()
  };

  const end = {
    longitude: position.lng,
    latitude: position.lat,
    bearing: position.heading,
    pitch: position.tilt,
    zoom: position.zoom
  };

  const duration = getFlyToDuration(start, end, opts);

  const tween = new Tween({f: 0})
    .duration(duration)
    .to({f: 1})
    .onUpdate(({f}) => {
      const viewport = flyToViewport(start, end, f, opts);
      console.log(viewport);
      map.moveCamera({
        center: {lat: viewport.latitude, lng: viewport.longitude},
        //heading: viewport.bearing,
        //tilt: viewport.pitch,
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
