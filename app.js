/* global document, google, window */
import {
  getTexasBoundarySimplifiedData,
  getWKTData,
  getPopulationData,
  getTexasTripData
} from './datasource';
import {createOverlay} from './overlay';
import {loadScript} from './utils';

import flyTo from './flyTo';

// Set your Google Maps API key here or via environment variable
const GOOGLE_MAPS_API_KEY = process.env.GoogleMapsAPIKey; // eslint-disable-line
const GOOGLE_MAP_ID = '95c4a86206596d98';
const GOOGLE_MAPS_API_URL = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&v=beta&map_ids=${GOOGLE_MAP_ID}`;

async function init() {
  const [_, boundaryData, countyData, populationData, tripData] = await Promise.all([
    loadScript(GOOGLE_MAPS_API_URL),
    getTexasBoundarySimplifiedData(),
    getWKTData('cartobq.nexus_demo.texas_counties'),
    getPopulationData()
    //getTexasTripData()
  ]);
  const map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 32, lng: -98},
    tilt: 0,
    heading: 0,
    zoom: 6,
    mapId: GOOGLE_MAP_ID
  });
  window.map = map;

  const overlay = createOverlay(map, {boundaryData, countyData, populationData});

  let truckToFollow = 9;

  function focusOnLocation(e) {
    overlay.truckToFollow = null;
    const {dataset} = e.srcElement;
    const lat = parseFloat(dataset.lat) || 40.72;
    const lng = parseFloat(dataset.lng) || -74;
    const tilt = parseFloat(dataset.tilt) || 0;
    const heading = parseFloat(dataset.heading) || 0;
    const zoom = parseFloat(dataset.zoom) || 15;
    flyTo(map, {lat, lng, tilt, heading, zoom});
  }

  ['texas', 'austin', 'houston'].forEach(l => {
    document.getElementById(`focus-${l}-btn`).addEventListener('click', focusOnLocation);
  });

  function updateTruckToFollow() {
    overlay.truckToFollow = truckToFollow;
  }
  document.getElementById('next-btn').addEventListener('click', () => {});
  document.getElementById('previous-btn').addEventListener('click', () => {});
  document.getElementById('print-location-btn').addEventListener('click', () => {
    const center = map.getCenter();
    const lat = center.lat();
    const lng = center.lng();
    const heading = map.getHeading();
    const tilt = map.getTilt();
    const zoom = map.getZoom();
    const config = {lat, lng, heading, tilt, zoom};
    console.log(
      Object.keys(config)
        .map(k => `data-${k}="${config[k]}"`)
        .join(' ')
    );
  });
}

init();
