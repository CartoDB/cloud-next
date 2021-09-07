import {Easing, Tween} from '@tweenjs/tween.js';
import {flyToViewport, getFlyToDuration} from '@math.gl/web-mercator';
export default function orbit(map, {heading}) {
  return new Tween({heading})
    .delay(1000)
    .duration(20000)
    .repeat(Infinity)
    .to({heading: heading + 360})
    .onUpdate(({heading}) => {
      map.moveCamera({heading});
    });
}
