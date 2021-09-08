import React from 'react';
import {Button, Typography, makeStyles, Box} from '@material-ui/core';
import {ReactComponent as NextIcon} from '../../assets/icons/icon-navigation-arrow-forward.svg';
import CoverBase from './CoverBase';
import {useAppState} from '../../state';

const useStyles = makeStyles((theme) => ({
  root: {
    top: theme.spacing(8),
    '@media (min-height: 760px)': {
      top: theme.spacing(15)
    }
  },
  pretitle: {
    fontWeight: 500,
    '& strong': {
      fontWeight: 600
    }
  },
  text: {
    opacity: 0.6
  }
}));

const CoverHero = () => {
  const {next} = useAppState();
  const classes = useStyles();

  return (
    <CoverBase className={classes.root}>
      <Typography className={classes.pretitle} color="inherit" variant="h5">
        Google Maps WebGL + CARTO
      </Typography>
      <Box mt={1.5} mb={4}>
        <Typography color="inherit" variant="h3">
          The Potential for Electrification of Truck Fleets
        </Typography>
      </Box>
      <Box mb={4}>
        <Typography color="inherit" variant="body1">
          Google Maps and CARTO have worked together to bring rich data visualization to web maps.
          To showcase those new capabilities we would like to present you with a map story about the
          potential for electrification of truck fleets. If you want to learn about how this has
          been made check out the About section.
        </Typography>
      </Box>
      <Button
        size="large"
        variant="contained"
        color="primary"
        onClick={next}
        endIcon={<NextIcon />}
      >
        Start
      </Button>
    </CoverBase>
  );
};

export default CoverHero;
