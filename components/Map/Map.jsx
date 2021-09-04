import React from 'react';
import {makeStyles} from '@material-ui/core';
import {useAppState} from '../../state';
import {SIDEBAR_WIDTH} from '../Sidebar/Sidebar';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%',
    flexGrow: 1,
    transition: theme.transitions.create(['margin', 'background-image'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    marginRight: `-${SIDEBAR_WIDTH.xs}`,
    [theme.breakpoints.up('lg')]: {
      marginRight: `-${SIDEBAR_WIDTH.lg}`
    }
  },
  rootShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    }),
    marginRight: 0
  },
  rootBlocked: {
    pointerEvents: 'none'
  },
  mapBlock: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    backgroundImage:
      'linear-gradient(to bottom, rgba(22, 39, 69, 0.84), rgba(22, 39, 69, 0.8) 65%, rgba(22, 39, 69, 0.2))',
    transition: theme.transitions.create('opacity', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  mapBlockHidden: {
    opacity: 0,
    pointerEvents: 'none'
  }
}));

const Map = () => {
  const classes = useStyles();
  const {currentSlide} = useAppState();

  return (
    <>
      <div
        className={[classes.root, currentSlide > 0 ? classes.rootShift : classes.rootBlocked].join(
          ' '
        )}
        id="map"
      ></div>
      <div
        className={[classes.mapBlock, currentSlide > 0 ? classes.mapBlockHidden : ''].join(' ')}
      />
    </>
  );
};

export default Map;
