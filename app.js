import '@babel/polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import Map from './components/Map/Map';
import InfoBar from './components/InfoBar/InfoBar';
import {createTheme} from './carto-theme';
import {CssBaseline, ThemeProvider} from '@material-ui/core';
import {AppStateStore} from './state';

const theme = createTheme();

const App = () => (
  <AppStateStore>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Map />
      <InfoBar />
    </ThemeProvider>
  </AppStateStore>
);

ReactDOM.render(<App />, document.getElementById('app'));

module.hot.accept();
