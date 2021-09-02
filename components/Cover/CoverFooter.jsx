import React from 'react';
import {Typography, makeStyles, Box} from '@material-ui/core';
import CoverBase from './CoverBase';

const useStyles = makeStyles((theme) => ({
  root: {
    bottom: theme.spacing(9)
  },
  content: {
    display: 'flex'
  },
  text: {
    opacity: 0.6
  }
}));

const CoverFooter = () => {
  const classes = useStyles();

  return (
    <CoverBase className={classes.root}>
      <div className={classes.content}>
        <div>
          <Typography variant="caption" className={classes.text} color="inherit">
            A story map by
          </Typography>
        </div>
        <Box pl={7}>
          <Typography variant="caption" className={classes.text} color="inherit">
            In collaboration with
          </Typography>
        </Box>
      </div>
    </CoverBase>
  );
};

export default CoverFooter;
