import React, {useState, useEffect} from 'react';
import {Button, Fade, Typography, makeStyles, Box, Grid} from '@material-ui/core';
import {ReactComponent as NextIcon} from '../../assets/icons/icon-navigation-arrow-forward.svg';
import {useAppState} from '../../state';

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'absolute',
    top: theme.spacing(15),
    bottom: theme.spacing(9),
    left: '50%',
    transform: 'translateX(-50%)',
    width: '100%',
    color: theme.palette.common.white,
    maxWidth: theme.spacing(142),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  rootHidden: {
    pointerEvents: 'none'
  },
  pretitle: {
    fontWeight: 500,
    '& strong': {
      fontWeight: 600
    }
  },
  text: {
    opacity: 0.6
  },
  footer: {
    display: 'flex'
  }
}));

const Cover = () => {
  const [show, setShow] = useState(false);
  const classes = useStyles();
  const {currentSlide, next} = useAppState();

  useEffect(() => {
    setShow(currentSlide === 0);
  }, [currentSlide, setShow]);

  return (
    <div className={[classes.root, !show ? classes.rootHidden : ''].join(' ')}>
      <Grid container>
        <Fade in={show}>
          <Grid item xs={12} md={6}>
            <Typography className={classes.pretitle} color="inherit" variant="h5">
              <strong>CARTO</strong> + Goolge Maps
            </Typography>
            <Box mt={1.5} mb={4}>
              <Typography color="inherit" variant="h3">
                The Potential for Electrification of Truck Fleets
              </Typography>
            </Box>
            <Box mb={4}>
              <Typography color="inherit" variant="body1">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum posuere magna
                vel ornare egestas. Maecenas lorem odio, dictum sit amet orci sed, aliquam facilisis
                lectus. In sit amet tincidunt erat.
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
          </Grid>
        </Fade>
      </Grid>
      <div className={classes.footer}>
        <div>
          <Typography variant="caption" className={classes.text} color="inherit">
            A story map by
          </Typography>
        </div>
        <Box pl={7}>
          <Typography variant="caption" className={classes.text} color="inherit">
            In collaboration with
          </Typography>
        </Box>
      </div>
    </div>
  );
};

export default Cover;
