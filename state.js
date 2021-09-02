import React, {useState, createContext, useContext, useEffect} from 'react';
import {createOverlay} from './overlay';
import {loadScript} from './utils';

import flyTo from './flyTo';

const GOOGLE_MAPS_API_KEY = process.env.GoogleMapsAPIKey; // eslint-disable-line
const GOOGLE_MAP_ID = '84591267f7b3a201';
const GOOGLE_MAPS_API_URL = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&v=beta&map_ids=${GOOGLE_MAP_ID}`;
const slides = [
  ['texas-thin-boundary'],
  ['population-heatmap', 'texas-boundary' /*'texas-counties'*/],
  ['power-lines', 'texas-boundary'],
  ['energy-sources', 'energy-sources-background', 'texas-boundary'],
  ['flowmap-layer'],
  ['truck-trips', 'texas-boundary']
];

const initAppState = {
  currentSlide: null
};

export const AppStateContext = createContext(initAppState);

let map, overlay;
let truckToFollow = 9;

export const AppStateStore = ({children}) => {
  const [currentSlide, setCurrentSlide] = useState(initAppState.currentSlide);

  useEffect(async () => {
    const [_] = await Promise.all([loadScript(GOOGLE_MAPS_API_URL)]);

    map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 32, lng: -98},
      tilt: 0,
      heading: 0,
      zoom: 6,
      mapId: GOOGLE_MAP_ID
    });

    overlay = createOverlay(map);
    setCurrentSlide(0);
  }, [setCurrentSlide]);

  useEffect(() => {
    if (currentSlide !== null && overlay?.visibleLayers) {
      overlay.visibleLayers = slides[currentSlide];
    }
  }, [currentSlide]);

  function updateTruckToFollow() {
    overlay.truckToFollow = truckToFollow;
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
          if (currentSlide < slides.length - 1) {
            setCurrentSlide(currentSlide + 1);
          }
        },
        prev: () => {
          if (currentSlide > 0) {
            setCurrentSlide(currentSlide - 1);
          }
        },
        reset: () => {
          setCurrentSlide(0);
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
              .map((k) => `data-${k}="${config[k]}"`)
              .join(' ')
          );
        },
        currentSlide
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
