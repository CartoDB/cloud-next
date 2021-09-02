import React, {useRef, useEffect, useState} from 'react';
import {makeStyles, Card, CardMedia, CardContent, Typography, Slide} from '@material-ui/core';
import Header from '../Header/Header';
import SidebarClose from '../Sidebar/SidebarClose';
import {useAppState} from '../../state';

const HEADER_HEIGHT = 72;

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: 'transparent',
    position: 'absolute',
    left: 0,
    top: 0,
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'overlay',
    borderBottom: '1px solid transparent',
    transition: theme.transitions.create(['border-color', 'transform'], {
      easing: theme.transitions.easing.easeInOut,
      duration: theme.transitions.duration.short
    })
  },
  rootOnScroll: {
    borderBottomColor: theme.palette.divider
  },
  rootAfter: {
    transform: 'translateX(100%)'
  },
  rootBefore: {
    transform: 'translateX(-100%)'
  },
  rootShown: {
    transform: 'translateX(0)'
  },
  media: {
    position: 'sticky',
    top: 0,
    left: 0,
    paddingTop: '57.4%',
    width: '100%',
    '&:after': {
      content: '""',
      width: '100%',
      height: theme.spacing(9),
      top: 0,
      left: 0,
      backgroundImage:
        'linear-gradient(to top, rgba(22, 39, 69, 0.02), rgba(22, 39, 69, 0.64) 63%, rgba(22, 39, 69, 0.92))',
      position: 'absolute'
    }
  },
  header: {
    position: 'sticky',
    top: 0,
    left: 0,
    width: '100%',
    minHeight: `${HEADER_HEIGHT}px`,
    marginBottom: `-${HEADER_HEIGHT}px`,
    zIndex: 2,
    display: 'none'
  },
  headerShown: {
    display: 'block'
  },
  innerHeader: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    height: '12px',
    backgroundColor: theme.palette.grey[50],
    overflow: 'hidden'
  },
  headerContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%'
  },
  headerClose: {
    position: 'absolute',
    margin: theme.spacing(3),
    bottom: 0,
    left: 0
  },
  headerItem: {
    top: 'auto',
    bottom: 0
  },
  content: {
    padding: theme.spacing(4, 6),
    flex: 1,
    zIndex: 1,
    backgroundColor: theme.palette.grey[50]
  },
  pretitle: {
    padding: theme.spacing(1, 0, 0.5),
    borderTop: `2px solid ${theme.palette.primary.main}`,
    fontWeight: 600
  },
  title: {
    color: theme.palette.primary.dark,
    marginBottom: theme.spacing(2)
  },
  subtitle: {
    color: theme.palette.primary.dark,
    marginBottom: theme.spacing(4.5)
  }
}));

const SidebarSlide = ({pretitle, title, subtitle, text, image, slide}) => {
  const cardRef = useRef();
  const cardContentRef = useRef();
  const classes = useStyles();
  const [isOnScroll, setIsOnScroll] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [show, setShow] = useState(slide === 1);
  const {currentSlide} = useAppState();

  const prevCurrentSlideRef = useRef();
  useEffect(() => {
    prevCurrentSlideRef.current = currentSlide;
  });
  const prevCurrentSlide = prevCurrentSlideRef.current;

  useEffect(() => {
    setShow(slide === currentSlide);
  }, [slide, currentSlide, prevCurrentSlide, setShow]);

  useEffect(() => {
    if (cardRef?.current && cardContentRef?.current) {
      const item = cardRef.current;
      const itemContent = cardContentRef.current;

      const scrollListener = () => {
        const hasScroll = item.scrollHeight > item.clientHeight;
        setIsOnScroll(hasScroll ? item.clientHeight + item.scrollTop < item.scrollHeight : false);
        const contentTop = itemContent.getBoundingClientRect().top;
        setHeaderHeight(
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
  }, [cardRef, cardContentRef, setIsOnScroll, setHeaderHeight]);

  return (
    <Card
      ref={cardRef}
      square={true}
      elevation={0}
      className={[
        classes.root,
        isOnScroll ? classes.rootOnScroll : '',
        slide > currentSlide ? classes.rootAfter : classes.rootBefore,
        (slide === 1 && currentSlide === 0) || slide === currentSlide ? classes.rootShown : ''
      ].join(' ')}
    >
      <div className={[classes.header, headerHeight > 0 ? classes.headerShown : ''].join(' ')}>
        <div className={classes.innerHeader} style={{height: headerHeight}}>
          <div className={classes.headerContent}>
            <SidebarClose className={classes.headerClose} primary={true} />
            <Header primary={true} className={classes.headerItem} />
          </div>
        </div>
      </div>
      <CardMedia className={classes.media} image={image} title={title} />
      <CardContent ref={cardContentRef} classes={{root: classes.content}}>
        <Typography
          className={classes.pretitle}
          variant="overline"
          color="primary"
          component="span"
        >
          {pretitle}
        </Typography>
        <Typography className={classes.title} variant="h5" color="primary" component="h2">
          {title}
        </Typography>
        <Typography className={classes.subtitle} variant="body1" color="primary" component="h3">
          {subtitle}
        </Typography>
        <Typography variant="body2" color="textPrimary" component="p">
          {text}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default SidebarSlide;
