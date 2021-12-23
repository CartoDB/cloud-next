import {getData, setDefaultCredentials, MAP_TYPES, API_VERSIONS} from '@deck.gl/carto';
import {WKTLoader} from '@loaders.gl/wkt';
import {parseSync} from '@loaders.gl/core';

setDefaultCredentials({
  apiVersion: API_VERSIONS.V3,
  apiBaseUrl: 'https://gcp-us-east1.api.carto.com',
  accessToken:
    'eyJhbGciOiJIUzI1NiJ9.eyJhIjoiYWNfN3hoZnd5bWwiLCJqdGkiOiJjZTY5M2NmMCJ9.9HD7U1c-Wh81SPaSvWWSNShF7MIMH-9-S8YmWFo0_x0'
});

const TIME0 = new Date('2021-01-01T06:30:00.000Z');
function parseRide(ride) {
  return {
    path: ride.geog.map(p => p.split(' ').map(parseFloat)),
    timestamps: ride.timestamps.map(t => {
      return (new Date(t) - TIME0) / 1000;
    })
  };
}

function parseWKT(f) {
  if (Array.isArray(f)) {
    f = f[0];
  }
  if (f.geom) {
    f.geometry = f.geom;
    delete f.geom;
  }
  const {geometry, ...properties} = f;
  return {
    type: 'Feature',
    geometry: parseSync(f.geometry, WKTLoader),
    properties
  };
}

export async function getTripData() {
  const data = await getData({
    type: MAP_TYPES.TABLE,
    source: 'cartobq.nexus_demo.trip_data_3',
    connection: 'bigquery',
    format: 'json',
    credentials: {
      accessToken:
        'eyJhbGciOiJIUzI1NiJ9.eyJhIjoiYWNfN3hoZnd5bWwiLCJqdGkiOiJiMzhmNzIyMiJ9.7xmoUCOI9ZkeAVBHrIw1kn6qdyAMtroN_umhR0i5ycc'
    }
  });

  const parsed = data.map(parseRide);
  return parsed;
}

export async function getPopulationData() {
  const data = await getData({
    type: MAP_TYPES.TABLE,
    source: `cartobq.nexus_demo.texas_pop_h3`,
    connection: 'bigquery',
    format: 'json',
    credentials: {
      accessToken:
        'eyJhbGciOiJIUzI1NiJ9.eyJhIjoiYWNfN3hoZnd5bWwiLCJqdGkiOiJiZDVhODUwYyJ9.fuaEK8KCYPR4EE8qpQkKBSPXcnh94OMsc2rN3TVc2zE'
    }
  });

  return data;
}

export async function getWKTData(source, credentials) {
  const data = await getData({
    type: MAP_TYPES.TABLE,
    source,
    connection: 'bigquery',
    format: 'json',
    ...credentials
  });

  return data.map(parseWKT);
}

export function getSingleTripData() {
  return [
    {
      path: [
        [-95.36403179168701, 29.75643270737706],
        [-95.36060929298401, 29.754346312706605],
        [-95.36121010780334, 29.753601161227223],
        [-95.36377429962158, 29.75516597293549],
        [-95.3649652004242, 29.753657047780315],
        [-95.36758303642273, 29.755231172893176],
        [-95.36462187767029, 29.75898475608521],
        [-95.3602659702301, 29.756367508201055],
        [-95.3608775138855, 29.755613057507748],
        [-95.3634524345398, 29.757159209611704],
        [-95.36399960517883, 29.75647927819111]
      ],
      timestamps: [0, 400, 500, 800, 1000, 1300, 1800, 2300, 2400, 2700, 2800]
    }
  ];
}
