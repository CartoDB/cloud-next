import React from 'react';
import {Button, Drawer, makeStyles, Fade} from '@material-ui/core';
import {useAppState} from '../../state';
import {ReactComponent as ArrowLeft} from '../../assets/icons/arrow-left.svg';
import {ReactComponent as ArrowRightWhite} from '../../assets/icons/arrow-right-white.svg';
import {ReactComponent as IconActionHome} from '../../assets/icons/icon-action-home.svg';

const useStyles = makeStyles((theme) => ({
  drawer: {
    width: theme.spacing(57.5),
    flexShrink: 0
  },
  drawerPaper: {
    width: theme.spacing(57.5),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%'
  },
  footer: {
    display: 'block',
    position: 'relative',
    width: '100%'
  },
  footerItem: {
    margin: theme.spacing(3, 0),
    position: 'absolute',
    bottom: 0,
    '&[data-position="left"]': {
      left: theme.spacing(3)
    },
    '&[data-position="right"]': {
      right: theme.spacing(3)
    },
    '&[data-position="center"]': {
      left: '50%',
      transform: 'translateX(-50%)',
      margin: theme.spacing(3, 0)
    }
  },
  dots: {
    display: 'flex',
    alignItems: 'center',
    minHeight: theme.spacing(4.5)
  },
  dot: {
    width: theme.spacing(1),
    height: theme.spacing(1),
    margin: theme.spacing(0.5),
    borderRadius: theme.spacing(0.5),
    backgroundColor: theme.palette.text.disabled,
    transition: theme.transitions.create('background-color', {
      easing: theme.transitions.easing.easeInOut,
      duration: theme.transitions.duration.short
    }),
    '&[data-active="true"]': {
      backgroundColor: theme.palette.primary.main
    }
  }
}));

const Sidebar = () => {
  const classes = useStyles();
  const {focusOnLocation, next, prev, reset, print, currentSlide} = useAppState();

  return (
    <Drawer
      className={classes.drawer}
      variant="persistent"
      anchor="right"
      open={currentSlide > 0}
      classes={{
        paper: classes.drawerPaper
      }}
    >
      <div>
        <h2>Key Locations</h2>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            focusOnLocation(32, -98, 0, 0, 6);
          }}
        >
          Texas
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            focusOnLocation(30.3, -97.7, 32, 29, 9);
          }}
        >
          Austin
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            focusOnLocation(29.8, -95.3, 33, 321, 9);
          }}
        >
          Houston
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            focusOnLocation(29.3, -98.4, 23, 5, 9);
          }}
        >
          San Antonio
        </Button>
        <h2>Slides</h2>
        <p>Choos`e between visualizations</p>

        <Button variant="outlined" color="primary" onClick={print}>
          Print Location
        </Button>
      </div>

      <div className={classes.footer}>
        <Fade in={currentSlide === 1}>
          <Button
            data-position="left"
            classes={{root: classes.footerItem}}
            startIcon={<IconActionHome />}
            variant="link"
            color="primary"
            onClick={reset}
          >
            Home
          </Button>
        </Fade>
        <Fade in={currentSlide > 1}>
          <Button
            data-position="left"
            classes={{root: classes.footerItem}}
            aria-label="Previous"
            startIcon={<ArrowLeft />}
            variant="link"
            color="primary"
            onClick={prev}
          />
        </Fade>
        <div className={[classes.dots, classes.footerItem].join(' ')} data-position="center">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div key={`dot-${i}`} className={classes.dot} data-active={i === currentSlide} />
          ))}
        </div>
        <Fade in={currentSlide !== 7}>
          <Button
            data-position="right"
            classes={{root: classes.footerItem}}
            variant="contained"
            color="primary"
            onClick={next}
            endIcon={<ArrowRightWhite />}
          >
            Next
          </Button>
        </Fade>
      </div>
    </Drawer>
  );
};

export default Sidebar;
