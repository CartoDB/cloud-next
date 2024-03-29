import React, {useState, createContext, useContext, useEffect} from 'react';
import slides from './slides';
import {createOverlay} from './overlay';
import {loadScript} from './utils';

import flyTo from './flyTo';
import orbit from './orbit';

//const GOOGLE_MAPS_API_KEY = process.env.GoogleMapsAPIKey; // eslint-disable-line
const GOOGLE_MAPS_API_KEY = 'AIzaSyC-D3n4Imi9m9KrCaa6p75qO525OoQE2Sk';
const GOOGLE_MAP_ID = '84591267f7b3a201';
const GOOGLE_MAPS_API_URL = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&map_ids=${GOOGLE_MAP_ID}`;

const initAppState = {
  currentSlide: null
};

export const AppStateContext = createContext(initAppState);

let map, overlay, tween;

export const AppStateStore = ({children}) => {
  const [currentSlide, setCurrentSlide] = useState(initAppState.currentSlide);

  useEffect(
    async () => {
      const [_] = await Promise.all([loadScript(GOOGLE_MAPS_API_URL)]);

      map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 36.7, lng: -99.2},
        heading: 0,
        tilt: 50,
        zoom: 5,
        keyboardShortcuts: false,
        clickableIcons: false,
        disableDefaultUI: true,
        mapId: GOOGLE_MAP_ID
      });

      map.addListener('mousedown', evt => {
        if (tween) {
          tween.stop();
          tween = null;
        }
      });

      overlay = createOverlay(map);
      setCurrentSlide(0);
    },
    [setCurrentSlide]
  );

  useEffect(
    () => {
      if (currentSlide !== null && overlay?.visibleLayers) {
        const {layers, view, orbit: shouldOrbit} = slides[currentSlide];
        overlay.visibleLayers = layers;
        if (view && view.lng !== undefined) {
          if (tween) {
            tween.stop();
          }
          tween = flyTo(map, view);
          if (shouldOrbit) {
            tween.chain(orbit(map, view));
          }
          tween.start();
        }
      }
    },
    [currentSlide]
  );

  return (
    <AppStateContext.Provider
      value={{
        focusOnLocation: (lat, lng, tilt, heading, zoom) => {
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
        currentSlide,
        slidesNumber: slides.length
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
window.print = () => {
  const center = map.getCenter();
  const lat = center.lat();
  const lng = center.lng();
  const heading = map.getHeading();
  const tilt = map.getTilt();
  const zoom = map.getZoom();
  const config = {lat, lng, heading, tilt, zoom};
  console.log(JSON.stringify(config));
};
