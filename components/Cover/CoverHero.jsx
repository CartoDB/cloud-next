import React from 'react';
import {Button, Typography, makeStyles, Box} from '@material-ui/core';
import {ReactComponent as NextIcon} from '../../assets/icons/icon-navigation-arrow-forward.svg';
import CoverBase from './CoverBase';
import {useAppState} from '../../state';

const useStyles = makeStyles((theme) => ({
  root: {
    top: theme.spacing(15)
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
        <strong>CARTO</strong> + Google Maps
      </Typography>
      <Box mt={1.5} mb={4}>
        <Typography color="inherit" variant="h3">
          The Potential for Electrification of Truck Fleets
        </Typography>
      </Box>
      <Box mb={4}>
        <Typography color="inherit" variant="body1">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum posuere magna vel
          ornare egestas. Maecenas lorem odio, dictum sit amet orci sed, aliquam facilisis lectus.
          In sit amet tincidunt erat.
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
