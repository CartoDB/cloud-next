const webpack = require('webpack');

const CONFIG = {
  mode: 'development',

  entry: {
    app: './app.js'
  },

  plugins: [
    // Read google maps token from environment variable
    new webpack.EnvironmentPlugin(['GoogleMapsAPIKey'])
  ]
};

module.exports = CONFIG;
