import React from 'react';
import {Button} from '@material-ui/core';

import {useAppState} from '../../state';

const InfoBar = () => {
  const {focusOnLocation, next, prev, print} = useAppState();

  return (
    <div id="info-bar" style={{position: 'absolute', left: '50%', top: 0, width: '50%'}}>
      <h2>Key Locations</h2>
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          focusOnLocation(32, -98, 0, 0, 6);
        }}
      >
        Texas
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          focusOnLocation(30.3, -97.7, 32, 29, 9);
        }}
      >
        Austin
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          focusOnLocation(29.8, -95.3, 33, 321, 9);
        }}
      >
        Houston
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          focusOnLocation(29.3, -98.4, 23, 5, 9);
        }}
      >
        San Antonio
      </Button>
      <h2>Slides</h2>
      <p>Choose between visualizations</p>
      <Button variant="contained" color="primary" onClick={next}>
        Previous
      </Button>
      <Button variant="contained" color="primary" onClick={prev}>
        Next
      </Button>
      <Button variant="outlined" color="primary" onClick={print}>
        Print Location
      </Button>
    </div>
  );
};

export default InfoBar;
