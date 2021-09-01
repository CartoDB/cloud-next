import {rgb} from 'd3-color';

export async function loadScript(url) {
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = url;
  const head = document.querySelector('head');
  head.appendChild(script);
  return new Promise(resolve => {
    script.onload = resolve;
  });
}

export function headingBetweenPoints(p1, p2) {
  const deltaLng = ((p2[0] - p1[0]) * Math.PI) / 180;
  const startLat = (p1[1] * Math.PI) / 180;
  const endLat = (p2[1] * Math.PI) / 180;

  const deltaPhi = Math.log(
    Math.tan(endLat / 2.0 + Math.PI / 4.0) / Math.tan(startLat / 2.0 + Math.PI / 4.0)
  );
  if (Math.abs(deltaLng) > Math.PI) {
    if (deltaLng > 0.0) {
      deltaLng = -(2.0 * Math.PI - deltaLng);
    } else {
      deltaLng = 2.0 * Math.PI + deltaLng;
    }
  }

  return (Math.atan2(deltaLng, deltaPhi) * 180) / Math.PI;
}

export function colorToRGBArray(color) {
  if (!color) {
    return [255, 255, 255, 0];
  }
  if (Array.isArray(color)) {
    return color.slice(0, 4);
  }
  const c = rgb(color);
  return [c.r, c.g, c.b, 255];
}
