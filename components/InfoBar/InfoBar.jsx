import React from 'react';
import {Button, Drawer, makeStyles} from '@material-ui/core';

import {useAppState} from '../../state';

const useStyles = makeStyles((theme) => ({
  drawer: {
    width: theme.spacing(57.5),
    flexShrink: 0
  },
  drawerPaper: {
    width: theme.spacing(57.5)
  }
}));

const InfoBar = () => {
  const classes = useStyles();
  const {focusOnLocation, next, prev, reset, print, currentSlide} = useAppState();

  return (
    <Drawer
      className={classes.drawer}
      variant="persistent"
      anchor="right"
      open={currentSlide > 0}
      classes={{
        paper: classes.drawerPaper
      }}
    >
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
      <Button variant="contained" color="primary" onClick={prev}>
        Previous
      </Button>
      <Button variant="contained" color="primary" onClick={next}>
        Next
      </Button>
      <Button variant="contained" color="primary" onClick={reset}>
        Close
      </Button>
      <Button variant="outlined" color="primary" onClick={print}>
        Print Location
      </Button>
    </Drawer>
  );
};

export default InfoBar;
