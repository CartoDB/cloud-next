const webpack = require('webpack');
const path = require('path');

const CONFIG = {
  mode: 'development',

  entry: {
    app: './index.js'
  },

  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/dist/'
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.svg$/,
        use: ['@svgr/webpack', 'file-loader']
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'file-loader'
          }
        ]
      }
    ]
  },

  resolve: {
    extensions: ['*', '.js', '.jsx']
  },

  plugins: [
    // Read google maps token from environment variable
    new webpack.EnvironmentPlugin(['GoogleMapsAPIKey']),
    new webpack.HotModuleReplacementPlugin()
  ],

  devServer: {
    contentBase: path.resolve(__dirname, './dist'),
    hot: true
  }
  },

  devtool: 'source-map'
};

module.exports = CONFIG;
