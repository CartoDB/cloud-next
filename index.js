import '@babel/polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import Main from './components/Main/Main';
import {createTheme} from './carto-theme';
import {CssBaseline, ThemeProvider} from '@material-ui/core';
import {AppStateStore} from './state';

const theme = createTheme();

const App = () => {
  return (
    <AppStateStore>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Main />
      </ThemeProvider>
    </AppStateStore>
  );
};

ReactDOM.render(<App />, document.getElementById('app'));

module.hot.accept();
