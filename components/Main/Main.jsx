import React from 'react';
import {makeStyles} from '@material-ui/core';
import Map from '../Map/Map';
import InfoBar from '../InfoBar/InfoBar';
import Cover from '../Cover/Cover';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    height: '100%',
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%'
  }
}));

const Main = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Map />
      <Cover />
      <InfoBar />
    </div>
  );
};

export default Main;
