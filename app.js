/* global document, google, window */
import {getData, setDefaultCredentials, MAP_TYPES, API_VERSIONS} from '@deck.gl/carto';
import {createOverlay} from './overlay.js';

import flyTo from './flyTo';

// Set your Google Maps API key here or via environment variable
const GOOGLE_MAPS_API_KEY = process.env.GoogleMapsAPIKey; // eslint-disable-line
const GOOGLE_MAP_ID = process.env.GoogleMapsMapId; // eslint-disable-line
const GOOGLE_MAPS_API_URL = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&v=beta&map_ids=${GOOGLE_MAP_ID}`;

function loadScript(url) {
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = url;
  const head = document.querySelector('head');
  head.appendChild(script);
  return new Promise(resolve => {
    script.onload = resolve;
  });
}

loadScript(GOOGLE_MAPS_API_URL).then(() => {
  const map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 40.72, lng: -74},
    tilt: 45,
    heading: 0,
    zoom: 15,
    mapId: GOOGLE_MAP_ID
  });

  createOverlay(map);

  document.getElementById('focus-btn').addEventListener('click', () => {
    flyTo(map, {lat: 40.72, lng: -74, tilt: 45, heading: 0, zoom: 13});
  });
});
