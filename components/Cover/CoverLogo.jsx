import React from 'react';
import {makeStyles} from '@material-ui/core';
import CoverBase from './CoverBase';
import cartoLogo from '../../assets/images/carto-components-logo-watermark.svg';
import {SIDEBAR_WIDTH} from '../Sidebar/Sidebar';

const useStyles = makeStyles((theme) => ({
  root: {
    bottom: theme.spacing(3.75),
    transform: `translateX(-50%)`,
    pointerEvents: 'none',
    width: 'auto',
    marginLeft: `-${SIDEBAR_WIDTH.xsNr / 2}px`,
    [theme.breakpoints.up('lg')]: {
      marginLeft: `-${SIDEBAR_WIDTH.lgNr / 2}px`
    }
  }
}));

const CoverLogo = () => {
  const classes = useStyles();

  return (
    <CoverBase slidesToShow={[1, 2, 3, 4, 5, 6, 7, 8]} className={classes.root}>
      <img alt="CARTO" src={cartoLogo} />
    </CoverBase>
  );
};

export default CoverLogo;
