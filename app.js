/* global document, google, window */
import {createOverlay} from './overlay';
import {loadScript} from './utils';

import flyTo from './flyTo';

// Set your Google Maps API key here or via environment variable
const GOOGLE_MAPS_API_KEY = process.env.GoogleMapsAPIKey; // eslint-disable-line
const GOOGLE_MAP_ID = process.env.GoogleMapsMapId; // eslint-disable-line
const GOOGLE_MAPS_API_URL = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&v=beta&map_ids=${GOOGLE_MAP_ID}`;

async function init() {
  await loadScript(GOOGLE_MAPS_API_URL);
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
}

init();
