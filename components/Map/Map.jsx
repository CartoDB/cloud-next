import React from 'react';
import {makeStyles} from '@material-ui/core';
import {useAppState} from '../../state';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%',
    flexGrow: 1,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    marginRight: theme.spacing(-57.5)
  },
  rootShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    }),
    marginRight: 0
  },
  rootBlocked: {
    pointerEvents: 'none',
    cursor: 'default'
  }
}));

const Map = () => {
  const classes = useStyles();
  const {currentSlide} = useAppState();

  return (
    <div
      className={[classes.root, currentSlide > 0 ? classes.rootShift : classes.rootBlocked].join(
        ' '
      )}
      id="map"
    ></div>
  );
};

export default Map;
