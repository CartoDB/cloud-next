import {getData, setDefaultCredentials, MAP_TYPES, API_VERSIONS} from '@deck.gl/carto';

setDefaultCredentials({
  apiVersion: API_VERSIONS.V3,
  apiBaseUrl: 'https://gcp-us-east1.api.carto.com',
  accessToken:
    'eyJhbGciOiJIUzI1NiJ9.eyJhIjoiYWNfN3hoZnd5bWwiLCJqdGkiOiJkODY4YmNhOCJ9.pw0Fx0RlzjjCkdK4uFfW8oQlO9WyZ9U-8oTbCt9UU1Y'
});

export async function getData() {
  return getData({
    type: MAP_TYPES.TABLE,
    source: `cartodb-gcp-backend-data-team.cloud_next.trips_v7`,
    connection: 'bigquery',
    format: 'json'
  });
}
