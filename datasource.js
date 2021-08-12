import {getData, setDefaultCredentials, MAP_TYPES, API_VERSIONS} from '@deck.gl/carto';

setDefaultCredentials({
  apiVersion: API_VERSIONS.V3,
  apiBaseUrl: 'https://gcp-us-east1.api.carto.com',
  accessToken:
    'eyJhbGciOiJIUzI1NiJ9.eyJhIjoiYWNfN3hoZnd5bWwiLCJqdGkiOiJkODY4YmNhOCJ9.pw0Fx0RlzjjCkdK4uFfW8oQlO9WyZ9U-8oTbCt9UU1Y'
});

const TIME0 = new Date('2021-08-10T00:00:00.000Z');
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

export async function getTripData() {
  const data = await getData({
    type: MAP_TYPES.TABLE,
    source: `cartodb-gcp-backend-data-team.cloud_next.trips_v7`,
    connection: 'bigquery',
    format: 'json'
  });

  return data.map(parseRide);
}
