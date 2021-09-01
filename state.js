import React, {useState, createContext, useContext, useEffect} from 'react';
import {
  getTexasBoundarySimplifiedData,
  getWKTData,
  getPopulationData,
  getTexasTripData
} from './datasource';
import {createOverlay} from './overlay';
import {loadScript} from './utils';

import flyTo from './flyTo';

const GOOGLE_MAPS_API_KEY = process.env.GoogleMapsAPIKey; // eslint-disable-line
const GOOGLE_MAP_ID = '95c4a86206596d98';
const GOOGLE_MAPS_API_URL = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&v=beta&map_ids=${GOOGLE_MAP_ID}`;
const slides = [
  ['texas-boundary' /*'texas-counties'*/],
  ['flowmap-layer'],
  ['population-heatmap', 'texas-boundary']
];

const initAppState = {};

export const AppStateContext = createContext(initAppState);

let map, overlay;
let truckToFollow = 9;
let currentSlide = 0;

export const AppStateStore = ({children}) => {
  useEffect(async () => {
    const [_, populationData, tripData] = await Promise.all([
      loadScript(GOOGLE_MAPS_API_URL),
      getPopulationData()
      //getTexasTripData()
    ]);

    map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 32, lng: -98},
      tilt: 0,
      heading: 0,
      zoom: 6,
      mapId: GOOGLE_MAP_ID
    });

    overlay = createOverlay(map, {populationData});
    updateVisibleLayers();
  }, []);

  function updateTruckToFollow() {
    overlay.truckToFollow = truckToFollow;
  }

  function updateVisibleLayers() {
    overlay.visibleLayers = slides[currentSlide];
  }

  return (
    <AppStateContext.Provider
      value={{
        focusOnLocation: (lat, lng, tilt, heading, zoom) => {
          overlay.truckToFollow = null;

          lat = lat || 40.72;
          lng = lng || -74;
          tilt = tilt || 0;
          heading = heading || 0;
          zoom = zoom || 15;

          flyTo(map, {lat, lng, tilt, heading, zoom});
        },
        next: () => {
          currentSlide = (currentSlide + 1) % slides.length;
          updateVisibleLayers();
        },
        prev: () => {
          currentSlide = (currentSlide + slides.length - 1) % slides.length;
          updateVisibleLayers();
        },
        print: () => {
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
        }
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
};

export const AppStateContextConsumer = AppStateContext.Consumer;

export function useAppState() {
  return useContext(AppStateContext);
}
