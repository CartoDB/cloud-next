import React from 'react';
import {Typography, makeStyles, Box} from '@material-ui/core';
import CoverBase from './CoverBase';
import cartoSymbol from '../../assets/images/carto-components-logo-negative-symbol.svg';

const useStyles = makeStyles((theme) => ({
  root: {
    pointerEvents: 'none',
    left: theme.spacing(3),
    top: theme.spacing(2),
    width: 'auto',
    transform: 'none'
  },
  content: {
    display: 'flex'
  },
  text: {
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)'
  }
}));

const CoverHeader = () => {
  const classes = useStyles();

  return (
    <CoverBase slidesToShow={[1, 2, 3, 4, 5, 6, 7]} className={classes.root}>
      <div className={classes.content}>
        <img src={cartoSymbol} alt="CARTO" />
        <Box pl={1.5}>
          <Typography variant="overline" className={classes.text} color="inherit">
            STORY MAP
          </Typography>
          <Typography variant="subtitle1" className={classes.text} color="inherit">
            The Potential for Electrification of Truck Fleets
          </Typography>
        </Box>
      </div>
    </CoverBase>
  );
};

export default CoverHeader;
