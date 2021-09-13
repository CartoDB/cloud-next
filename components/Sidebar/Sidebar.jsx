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
import slide8Image from '../../assets/images/slide8.jpg';

export const SIDEBAR_WIDTH = {
  xs: '400px',
  xsNr: 400,
  lg: '460px',
  lgNr: 460
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
          title="The second-largest state in the US by both area and population"
          subtitle="With a population of over 29M people, which has increased 15.9% since 2010."
          image={slide1Image}
          imageAttribution={`Photo by <a target="_blank" href="https://unsplash.com/@juvx?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Vlad Busuioc</a> on <a target="_blank" href="https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>`}
        >
          <p>
          Two-thirds of all Texans live in major metropolitan areas such as Houston. The Dallas–Fort Worth metropolitan area is the largest in Texas, while Houston is the largest city,  and the fourth-largest city in the United States.  
          By population, the Dallas–Fort Worth metropolitan area is larger than the city and metropolitan area of Houston.
          </p>
        </SidebarSlide>
        <SidebarSlide
          slide={2}
          {...(currentSlide === 2 && {ref: currentCardRef})}
          title="The largest consumer and contributor of energy"
          subtitle="Texas ranks second in the nation in both population and the size of its economy, it also consumes a large share of the nation's energy."
          text="In 2018, Texas accounted for about one-seventh of U.S. energy consumption, more than any other state.Texas ranks  sixth nationally  in per capita energy consumption. The state is also the nation's third-largest net energy supplier, despite its high energy usage."
          image={slide2Image}
          imageAttribution={`Photo by <a target="_blank" href="https://unsplash.com/@matthewhenry?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Matthew Henry</a> on <a target="_blank" href="https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>`}
        />
        <SidebarSlide
          slide={3}
          {...(currentSlide === 3 && {ref: currentCardRef})}
          title="The largest  producer of renewable energy"
          subtitle="Renewable energy fueled more than one-fifth of all utility-scale net generation in Texas in 2020, and the state accounted for one-fifth of the nation's utility-scale electricity generation from non-hydroelectric renewable sources."
          text="In Texas, wind accounts for nearly all of the electricity generated from renewable resources."
          image={slide3Image}
          imageAttribution={`Photo by <a target="_blank" href="https://unsplash.com/@viazavier?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Laura Ockel</a> on <a target="_blank" href="https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>`}
        />
        <SidebarSlide
          slide={4}
          {...(currentSlide === 4 && {ref: currentCardRef})}
          title="Transportation is the second largest consumer of energy in Texas"
          subtitle="Trucks in Texas represent 12% of all vehicle miles travelled in the state each year. Road transportation continues to be the largest contributor to total CO2 emissions in Texas— estimated at more than 225 million tons each year."
          text=""
          image={slide4Image}
          imageAttribution={`Photo by <a target="_blank" href="https://unsplash.com/@charlfolscher?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Charl Folscher</a> on <a target="_blank" href="https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>`}
        />
        <SidebarSlide
          slide={5}
          {...(currentSlide === 5 && {ref: currentCardRef})}
          title="73% of goods manufactured in Texas are transported by truck"
          subtitle="Trucking is big business in Texas. With more than 60,000 trucking companies in the state employing 185,000 drivers, the impacts of any vehicle electrification measures are significant, not only on the environment, but also the local economy."
          text=""
          image={slide5Image}
          imageAttribution={`Photo by <a target="_blank" href="https://unsplash.com/@chuttersnap?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">CHUTTERSNAP</a> on <a target="_blank" href="https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>`}
        />
        <SidebarSlide
          slide={6}
          {...(currentSlide === 6 && {ref: currentCardRef})}
          title="Commercial truck electrification is well within reach"
          subtitle="Fully electric trucks are reaching wider-scale consideration as truck, engine, and other component manufacturers are developing the systems required to support this new breed of commercial vehicles."
          text="These electrified trucks will bring many benefits (cleaner, renewable  energy consumption and simpler designs), but come with some additional challenges, such as the need for an updated  infrastructure and R&D investments."
          image={slide6Image}
          imageAttribution={`Photo by <a target="_blank" href="https://unsplash.com/@gerandeklerk?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Geran de Klerk</a> on <a target="_blank" href="https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>`}
        />
        <SidebarSlide
          slide={7}
          {...(currentSlide === 7 && {ref: currentCardRef})}
          title="Focusing on long-haul trucks will require a charging infrastructure at scale."
          subtitle="Utilizing aggregated data from existing truck fleets, and considering the most common  routes, it is possible to determine optimal locations to install the required charging infrastructure."
          text="In this map, 4,780 of the most popular stops are analyzed. Using spatial analytics, different models can be created based on the phased roll out of electric truck fleets."
          image={slide7Image}
          imageAttribution={`Photo by <a target="_blank" href="https://unsplash.com/@sophiejonas?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Sophie Jonas</a> on <a target="_blank" href="https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>`}
        />
        <SidebarSlide
          slide={8}
          {...(currentSlide === 8 && {ref: currentCardRef})}
          title="Rising temperatures in Texas could have devastating impacts across sectors"
          subtitle="Depleted water resources, increasing wildfires, and expanding deserts are expected to cause significant damage to agriculture, human health, and infrastructure."
          text="Using data and spatial analysis to evaluate the impacts of change on critical sectors will be key to prioritizing investments in climate resilience. The time to act is now."
          image={slide8Image}
          imageAttribution={`Photo by <a target="_blank" href="https://unsplash.com/@alecimages?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Chenyu Guan</a> on <a target="_blank" href="https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>`}
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
