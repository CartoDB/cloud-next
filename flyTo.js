import {Easing, Tween} from '@tweenjs/tween.js';

export default function flyTo(map, position) {
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
    duration += 300 * Math.abs(position.zoom - zoom);
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
