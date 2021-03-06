import React from 'react';
import {makeStyles} from '@material-ui/core';
import {useAppState} from '../../state';
import {SIDEBAR_WIDTH} from '../Sidebar/Sidebar';
import CoverLogo from '../Cover/CoverLogo';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%',
    flexGrow: 1,
    transition: theme.transitions.create(['margin', 'background-image'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  rootShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    }),
    marginBottom: theme.spacing(15),
    height: 'auto',
    [theme.breakpoints.up('md')]: {
      marginBottom: 0,
      height: '100%',
      marginRight: `${SIDEBAR_WIDTH.xs}`,
      [theme.breakpoints.up('lg')]: {
        marginRight: `${SIDEBAR_WIDTH.lg}`
      }
    }
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
      'linear-gradient(to bottom, rgba(15, 17, 20, 0.84), rgba(15, 17, 20, 0.8) 65%, rgba(15, 17, 20, 0.2))',
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
      <CoverLogo />
      <div
        className={[classes.mapBlock, currentSlide > 0 ? classes.mapBlockHidden : ''].join(' ')}
      />
    </>
  );
};

export default Map;
