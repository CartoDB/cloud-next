import {Easing, Tween} from '@tweenjs/tween.js';
export default function orbit(map, {heading}) {
  return new Tween({heading})
    .delay(200)
    .easing(Easing.Quadratic.In)
    .duration(60000)
    .repeat(Infinity)
    .to({heading: heading + 360})
    .onUpdate(({heading}) => {
      map.moveCamera({heading});
    });
}
