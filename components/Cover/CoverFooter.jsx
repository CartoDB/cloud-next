import React from 'react';
import {Typography, makeStyles, Box} from '@material-ui/core';
import CoverBase from './CoverBase';
import cartoLogo from '../../assets/images/carto-components-logo-negative-logo.svg';
import googleMapsLogo from '../../assets/images/google-maps-logo.svg';
import geotapLogo from '../../assets/images/geotap.svg';
import climateEngineLogo from '../../assets/images/climate-engine-logo@2x.png';

const useStyles = makeStyles((theme) => ({
  root: {
    bottom: theme.spacing(9)
  },
  content: {
    display: 'flex'
  },
  text: {
    opacity: 0.6,
    marginBottom: theme.spacing(3)
  },
  logos: {
    display: 'flex',
    alignItems: 'center',
    '& img + img': {
      marginLeft: theme.spacing(7)
    }
  },
  climateEngineLogo: {
    maxWidth: theme.spacing(17)
  }
}));

const CoverFooter = () => {
  const classes = useStyles();

  return (
    <CoverBase className={classes.root}>
      <div className={classes.content}>
        <div>
          <Typography component="h5" variant="caption" className={classes.text} color="inherit">
            A story map by
          </Typography>
          <img src={cartoLogo} alt="CARTO" />
        </div>
        <Box pl={7}>
          <Typography component="h5" variant="caption" className={classes.text} color="inherit">
            In collaboration with
          </Typography>
          <div className={classes.logos}>
            <img src={googleMapsLogo} alt="Google Maps" />
            <img src={geotapLogo} alt="GEOTAB" />
            <img
              className={classes.climateEngineLogo}
              src={climateEngineLogo}
              alt="Climate Engine"
            />
          </div>
        </Box>
      </div>
    </CoverBase>
  );
};

export default CoverFooter;
