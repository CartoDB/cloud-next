import React from 'react';
import {makeStyles} from '@material-ui/core';
import Map from '../Map/Map';
import Sidebar from '../Sidebar/Sidebar';
import CoverHero from '../Cover/CoverHero';
import CoverFooter from '../Cover/CoverFooter';
import CoverHeader from '../Cover/CoverHeader';

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
      <CoverHeader />
      <CoverHero />
      <CoverFooter />
      <Sidebar />
    </div>
  );
};

export default Main;
