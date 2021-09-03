import {getData, setDefaultCredentials, MAP_TYPES, API_VERSIONS} from '@deck.gl/carto';
import {WKTLoader} from '@loaders.gl/wkt';
import {parseSync} from '@loaders.gl/core';

setDefaultCredentials({
  apiVersion: API_VERSIONS.V3,
  apiBaseUrl: 'https://gcp-us-east1.api.carto.com',
  accessToken:
    'eyJhbGciOiJIUzI1NiJ9.eyJhIjoiYWNfN3hoZnd5bWwiLCJqdGkiOiJjZTY5M2NmMCJ9.9HD7U1c-Wh81SPaSvWWSNShF7MIMH-9-S8YmWFo0_x0'
});

const TIME0 = new Date('2021-01-01T07:00:00.000Z');
function groupIntoRides(data) {
  const rides = [];
  let lastId = null;
  for (const d of data) {
    const id = d['vehicle_id'];
    if (lastId !== id) {
      rides.push({
        vehicle_id: 0,
        positions: [d.geom],
        timestamps: [d.timestamp]
      });
      lastId = id;
    }

    // Points are not ordered by time, so need to insert in
    // correct order
    const ride = rides[rides.length - 1];
    for (let i = 0; i < ride.timestamps.length; i++) {
      if (i === ride.timestamps.length) {
        // Append to end if we failed to insert
        ride.positions.splice(i, 0, d.geom);
        ride.timestamps.splice(i, 0, d.timestamp);
      } else if (new Date(d.timestamp) < new Date(ride.timestamps[i])) {
        // Insert before current item if earlier in time
        ride.positions.splice(i, 0, d.geom);
        ride.timestamps.splice(i, 0, d.timestamp);
        break;
      }
    }
  }

  return rides;
}

function parseRide(ride) {
  return {
    vendor: parseInt(ride.vehicle_id),
    path: ride.positions.map(p =>
      p
        .slice(6, -1)
        .split(' ')
        .map(parseFloat)
    ),
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
    source: 'cartobq.nexus_demo.trip_data',
    connection: 'bigquery',
    format: 'json',
    credentials: {
      accessToken:
        'eyJhbGciOiJIUzI1NiJ9.eyJhIjoiYWNfN3hoZnd5bWwiLCJqdGkiOiIzNzk5MTIyNyJ9.HMotdRO3VY7xgmt-h5f9wELA_WnvtkBRejzDREChwVs'
    }
  });

  // TODO grouping is really slow. Should do on server
  let rides = groupIntoRides(data.slice(0, 20000));
  rides = rides.filter(r => r.timestamps.length > 30);
  const parsed = rides.map(parseRide);
  debugger;
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

export async function getWKTData(source) {
  const data = await getData({
    type: MAP_TYPES.TABLE,
    source,
    connection: 'bigquery',
    format: 'json'
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
