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
  const tween = new Tween({
    lat: center.lat(),
    lng: center.lng(),
    heading,
    tilt: map.getTilt(),
    zoom: map.getZoom()
  }).easing(Easing.Quadratic.InOut);
  tween
    .to(position)
    .onUpdate(({lat, lng, heading, tilt, zoom}) => {
      map.moveCamera({center: {lat, lng}, heading, tilt, zoom});
    })
    .start();
}
