import React from 'react';
import {Button, Drawer, makeStyles} from '@material-ui/core';

import {useAppState} from '../../state';

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'absolute',
    top: '10%',
    left: '10%',
    width: '40%'
  }
}));

const Cover = () => {
  const classes = useStyles();
  const {currentSlide, next} = useAppState();

  return currentSlide === 0 ? (
    <div className={classes.root}>
      <Button size="large" variant="contained" color="primary" onClick={next}>
        Start
      </Button>
    </div>
  ) : null;
};

export default Cover;
