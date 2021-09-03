import React, {useState, useEffect, useRef} from 'react';
import {Button, IconButton, Drawer, makeStyles, Fade} from '@material-ui/core';
import {useAppState} from '../../state';
import {ReactComponent as ArrowLeft} from '../../assets/icons/arrow-left.svg';
import {ReactComponent as ArrowRightWhite} from '../../assets/icons/arrow-right-white.svg';
import {ReactComponent as IconActionHome} from '../../assets/icons/icon-action-home.svg';
import SidebarSlide from './SidebarSlide';
import SidebarClose from './SidebarClose';
import Header, {HEADER_HEIGHT} from '../Header/Header';
import slide1Image from '../../assets/images/slide1.jpg';
import slide2Image from '../../assets/images/slide2.jpg';
import slide3Image from '../../assets/images/slide3.jpg';
import slide4Image from '../../assets/images/slide4.jpg';
import slide5Image from '../../assets/images/slide5.jpg';
import slide6Image from '../../assets/images/slide6.jpg';
import slide7Image from '../../assets/images/slide7.jpg';

export const SIDEBAR_WIDTH = {
  xs: '400px',
  lg: '460px'
};

const useStyles = makeStyles((theme) => ({
  drawer: {
    flexShrink: 0,
    zIndex: 1,
    '&, & $drawerPaper': {
      width: SIDEBAR_WIDTH.xs
    },
    [theme.breakpoints.up('lg')]: {
      '&, & $drawerPaper': {
        width: SIDEBAR_WIDTH.lg
      }
    }
  },
  drawerPaper: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    backgroundColor: theme.palette.grey[50],
    border: 'none'
  },
  footer: {
    display: 'block',
    position: 'relative',
    width: '100%',
    minHeight: theme.spacing(10.5)
  },
  footerItem: {
    margin: theme.spacing(3, 0),
    position: 'absolute',
    bottom: 0,
    '&[data-position="left"]': {
      left: theme.spacing(3)
    },
    '&[data-position="top-left"]': {
      left: theme.spacing(3),
      bottom: 'auto',
      top: 0,
      zIndex: 1
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
  },
  slides: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
    width: '100%'
  },
  headerPrimary: {
    position: 'absolute',
    zIndex: 1,
    left: 0,
    width: '100%',
    zIndex: 2,
    display: 'none',
    bottom: `calc(100% - ${HEADER_HEIGHT}px)`,
    height: 0,
    backgroundColor: theme.palette.grey[50],
    overflow: 'hidden'
  },
  headerPrimaryShown: {
    display: 'block'
  },
  headerPrimaryClose: {
    position: 'absolute',
    margin: theme.spacing(3),
    bottom: 0,
    left: 0
  },
  headerPrimaryItem: {
    top: 'auto',
    bottom: 0
  }
}));

const Sidebar = () => {
  const classes = useStyles();
  const {next, prev, reset, currentSlide, slidesNumber} = useAppState();
  const [headerPrimaryHeight, setHeaderPrimaryHeight] = useState(0);
  const currentCardRef = useRef();

  useEffect(() => {
    if (currentCardRef?.current) {
      const item = currentCardRef.current;
      const itemContent = item.querySelector('[data-content="true"]');

      const scrollListener = () => {
        const contentTop = itemContent.getBoundingClientRect().top;
        setHeaderPrimaryHeight(
          contentTop > HEADER_HEIGHT
            ? 0
            : contentTop > 0
            ? HEADER_HEIGHT - contentTop
            : HEADER_HEIGHT
        );
      };
      item.addEventListener('scroll', scrollListener);
      scrollListener();
      return () => {
        item?.removeEventListener('scroll', scrollListener);
      };
    }
  }, [currentCardRef.current, setHeaderPrimaryHeight]);

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
      <Header showDelay={500} hideDelay={0} hidden={currentSlide === 0} />
      <div
        className={[
          classes.headerPrimary,
          headerPrimaryHeight > 0 ? classes.headerPrimaryShown : ''
        ].join(' ')}
        style={{height: headerPrimaryHeight}}
      >
        <SidebarClose className={classes.headerPrimaryClose} primary={true} />
        <Header primary={true} className={classes.headerPrimaryItem} />
      </div>

      <div className={classes.footerItem} data-position="top-left">
        <SidebarClose />
      </div>

      <div className={classes.slides}>
        <SidebarSlide
          slide={1}
          {...(currentSlide === 1 && {ref: currentCardRef})}
          title="The second-largest state by both area and population"
          subtitle="With a population of over 29M and 15.9% increase since 2010"
          text="Although second on population, due to its size is one of the least dense overall but with high concentration if a few areas like Dallas, Houston and San Antonio."
          image={slide1Image}
        />
        <SidebarSlide
          slide={2}
          {...(currentSlide === 2 && {ref: currentCardRef})}
          title="The largest energy consumer and contributor"
          subtitle="Texas ranks second in the nation in both population and the size of its economy, and it consumes a large share of the nation's energy."
          text="In 2018, Texas accounted for about one-seventh of U.S. energy consumption, more than any other state. However, Texas was sixth in the nation in per capita energy consumption."
          image={slide2Image}
        />
        <SidebarSlide
          slide={3}
          {...(currentSlide === 3 && {ref: currentCardRef})}
          title="The biggest producer of renewal energy"
          subtitle="Renewable energy fueled more than one-fifth of all utility-scale net generation in Texas in 2020, and the state accounted for one-fifth of the nation's utility-scale electricity generation from nonhydroelectric renewable sources."
          text="Wind accounts for nearly all of the electricity generated from renewable resources in Texas."
          image={slide3Image}
        />
        <SidebarSlide
          slide={4}
          {...(currentSlide === 4 && {ref: currentCardRef})}
          title="Transportation is the second largest consumer of energy in Texas"
          subtitle="accounts for one-fourth of state end-use consumption, in part because of the large number of registered motor vehicles in Texas, the great distances across the state, and the high number of vehicle miles traveled annually."
          text="And fright within..."
          image={slide4Image}
        />
        <SidebarSlide
          slide={5}
          {...(currentSlide === 5 && {ref: currentCardRef})}
          title="2M trucks move everyday moving fright"
          subtitle="accounts for one-fourth of state end-use consumption, in part because of the large number of registered motor vehicles in Texas, the great distances across the state, and the high number of vehicle miles traveled annually."
          text="And fright within..."
          image={slide5Image}
        />
        <SidebarSlide
          slide={6}
          {...(currentSlide === 6 && {ref: currentCardRef})}
          title="Electrifying a truck removes 200T of Co2 per day"
          subtitle="accounts for one-fourth of state end-use consumption, in part because of the large number of registered motor vehicles in Texas, the great distances across the state, and the high number of vehicle miles traveled annually."
          text="And fright within..."
          image={slide6Image}
        />
        <SidebarSlide
          slide={7}
          {...(currentSlide === 7 && {ref: currentCardRef})}
          title="Analyzing the stops of current trucks we can design where to install charging stations"
          subtitle="accounts for one-fourth of state end-use consumption, in part because of the large number of registered motor vehicles in Texas, the great distances across the state,"
          text=""
          image={slide7Image}
        />
        <SidebarSlide
          slide={8}
          {...(currentSlide === 8 && {ref: currentCardRef})}
          title="Teas will be one of the most affected states by Global warming"
          subtitle="accounts for one-fourth of state end-use consumption, in part because of the large number of registered motor vehicles in Texas, the great distances across the state,"
          text="accounts for one-fourth of state end-use consumption, in part because of the large number of registered motor vehicles in Texas, the great distances across the state, accounts for one-fourth of state end-use consumption, in part because of the large number of registered motor vehicles in Texas, the great distances across the state, accounts for one-fourth of state end-use consumption, in part because of the large number of registered motor vehicles in Texas, the great distances across the state, accounts for one-fourth of state end-use consumption, in part because of the large number of registered motor vehicles in Texas, the great distances across the state, accounts for one-fourth of state end-use consumption, in part because of the large number of registered motor vehicles in Texas, the great distances across the state, accounts for one-fourth of state end-use consumption, in part because of the large number of registered motor vehicles in Texas, the great distances across the state, accounts for one-fourth of state end-use consumption, in part because of the large number of registered motor vehicles in Texas, the great distances across the state, accounts for one-fourth of state end-use consumption, in part because of the large number of registered motor vehicles in Texas, the great distances across the state, accounts for one-fourth of state end-use consumption, in part because of the large number of registered motor vehicles in Texas, the great distances across the state, accounts for one-fourth of state end-use consumption, in part because of the large number of registered motor vehicles in Texas, the great distances across the state,"
          image={slide7Image}
        />
      </div>

      <div className={classes.footer}>
        <Fade in={currentSlide === 1}>
          <Button
            data-position="left"
            classes={{root: classes.footerItem}}
            startIcon={<IconActionHome />}
            color="primary"
            onClick={reset}
          >
            Home
          </Button>
        </Fade>
        <Fade in={currentSlide > 1}>
          <IconButton
            data-position="left"
            classes={{root: classes.footerItem}}
            aria-label="Previous"
            color="primary"
            onClick={prev}
          >
            <ArrowLeft />
          </IconButton>
        </Fade>
        <div className={[classes.dots, classes.footerItem].join(' ')} data-position="center">
          {[...new Array(slidesNumber - 1)].map((item, i) => (
            <div
              key={`dot-${i + 1}`}
              className={classes.dot}
              data-active={i + 1 === currentSlide}
            />
          ))}
        </div>
        <Fade in={currentSlide !== slidesNumber - 1}>
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
