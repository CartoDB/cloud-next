import {getData, setDefaultCredentials, MAP_TYPES, API_VERSIONS} from '@deck.gl/carto';
import {WKTLoader} from '@loaders.gl/wkt';
import {parseSync} from '@loaders.gl/core';

setDefaultCredentials({
  apiVersion: API_VERSIONS.V3,
  apiBaseUrl: 'https://gcp-us-east1.api.carto.com',
  accessToken:
    'eyJhbGciOiJIUzI1NiJ9.eyJhIjoiYWNfN3hoZnd5bWwiLCJqdGkiOiJjZTY5M2NmMCJ9.9HD7U1c-Wh81SPaSvWWSNShF7MIMH-9-S8YmWFo0_x0'
});

const TIME0 = new Date('2021-01-01T10:04:00.000Z');
function groupIntoRides(data) {
  const rides = [];
  let lastId = null;
  for (const d of data) {
    const id = d['vehicle_id'];
    if (lastId !== id) {
      rides.push({vehicle_id: 0, positions: [], timestamps: []});
      lastId = id;
    }

    const ride = rides[rides.length - 1];
    ride.positions.push(d.geom);
    ride.timestamps.push(d.timestamp);
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

  const rides = groupIntoRides(data);
  return rides.map(parseRide);
}

export async function getPopulationData() {
  const data = await getData({
    type: MAP_TYPES.TABLE,
    source: `cartobq.nexus_demo.texas_pop_h3`,
    connection: 'bigquery',
    format: 'json'
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

export async function getTexasTripData() {
  const data = await getData({
    type: MAP_TYPES.QUERY,
    source:
      'SELECT geogpoint as geom, timestamp, vehicle_id FROM `cartobq.nexus_demo.trip_data_test3` TABLESAMPLE SYSTEM (1 PERCENT) limit 150000',
    connection: 'bigquery',
    format: 'json'
  });

  return data.map(parseWKT);
}

export async function getTexasBoundaryData() {
  const data = await getData({
    type: MAP_TYPES.QUERY,
    source: 'SELECT ST_SIMPLIFY(geometry,100) as geom FROM `cartobq.nexus_demo.texas_boundary`',
    connection: 'bigquery',
    format: 'json',
    credentials: {
      accessToken:
        'eyJhbGciOiJIUzI1NiJ9.eyJhIjoiYWNfN3hoZnd5bWwiLCJqdGkiOiIzYWZhODUyOSJ9.bCrMmLKkMAgA21Y14js5up8CR4IJ45xhENzXo-CuHMs'
    }
  });

  return data.map(parseWKT);
}

export async function getTexasBoundarySimplifiedData() {
  const data = await getData({
    type: MAP_TYPES.TABLE,
    source: 'cartobq.nexus_demo.texas_boundary_simplified',
    connection: 'bigquery',
    format: 'json',
    credentials: {
      accessToken:
        'eyJhbGciOiJIUzI1NiJ9.eyJhIjoiYWNfN3hoZnd5bWwiLCJqdGkiOiIzYWZhODUyOSJ9.bCrMmLKkMAgA21Y14js5up8CR4IJ45xhENzXo-CuHMs'
    }
  });

  return data.map(parseWKT);
}
