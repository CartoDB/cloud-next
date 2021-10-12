import React from 'react';
import {makeStyles} from '@material-ui/core';
import CoverBase from './CoverBase';
import cartoLogo from '../../assets/images/carto-components-logo-negative-logo.svg';
import googleMapsLogo from '../../assets/images/google-maps-logo.svg';
import googleLogos from '../../assets/images/google-logos.png';
import CoverLogoBlock from './CoverLogoBlock';

const useStyles = makeStyles((theme) => ({
  root: {
    bottom: theme.spacing(5),
    '@media (min-height: 760px)': {
      bottom: theme.spacing(9)
    }
  },
  content: {
    display: 'flex'
  },
  text: {
    opacity: 0.6
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
        <CoverLogoBlock
          title="A story map by"
          textClassName={classes.text}
          images={[
            {
              src: cartoLogo,
              href: 'https://carto.com/',
              alt: 'CARTO'
            }
          ]}
        />
        <CoverLogoBlock
          title="In collaboration with"
          textClassName={classes.text}
          images={[
            {
              src: googleLogos,
              alt: 'Google Maps'
            }
          ]}
        />
      </div>
    </CoverBase>
  );
};

export default CoverFooter;
