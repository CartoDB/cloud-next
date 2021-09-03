import React, {forwardRef, useImperativeHandle, useState} from 'react';
import {
  Button,
  makeStyles,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  IconButton,
  Typography,
  Link,
  Paper
} from '@material-ui/core';
import {ReactComponent as IconNavigationClose} from '../../assets/icons/icon-navigation-close.svg';
import {ReactComponent as IconGithub} from '../../assets/icons/icon-github.svg';
import CoverLogoBlock from '../Cover/CoverLogoBlock';
import cartoLogo from '../../assets/images/carto-components-logo.svg';
import googleMapsLogo from '../../assets/images/google-maps-logo.svg';

const useStyles = makeStyles((theme) => ({
  paper: {
    maxHeight: `calc(100% - ${theme.spacing(18)}px)`
  },
  title: {
    padding: theme.spacing(3),
    position: 'relative'
  },
  closeBtn: {
    position: 'absolute',
    right: theme.spacing(2),
    top: '50%',
    transform: 'translateY(-50%)',
    '& svg path': {
      fill: theme.palette.text.secondary
    }
  },
  content: {
    padding: theme.spacing(2, 3)
  },
  contentTitle: {
    color: theme.palette.primary.dark,
    marginBottom: theme.spacing(1.5)
  },
  logos: {
    display: 'flex',
    color: theme.palette.text.secondary,
    margin: theme.spacing(4.5, 0, 6)
  },
  logosText: {
    marginBottom: theme.spacing(2),
    fontWeight: 400
  },
  card: {
    padding: theme.spacing(3, 3, 4.5),
    backgroundColor: theme.palette.grey[50],
    display: 'flex'
  },
  cardText: {
    flex: 1
  },
  cardTextTitle: {
    textTransform: 'uppercase',
    color: theme.palette.primary.dark,
    marginBottom: theme.spacing(1)
  },
  cardTextButtons: {
    display: 'flex',
    marginTop: theme.spacing(3),
    '& > a + a': {
      marginLeft: theme.spacing(1)
    }
  }
}));

const About = ({}, forwardedRef) => {
  const [open, setOpen] = useState(false);
  const classes = useStyles();

  useImperativeHandle(forwardedRef, () => ({
    show: () => {
      setOpen(true);
    }
  }));

  return (
    <Dialog
      open={open}
      scroll="paper"
      aria-labelledby="about-title"
      aria-describedby="about-description"
      classes={{
        paper: classes.paper
      }}
    >
      <DialogTitle id="about-title" disableTypography classes={{root: classes.title}}>
        <Typography color="textPrimary" variant="h6">
          About this project
        </Typography>
        <IconButton
          classes={{root: classes.closeBtn}}
          aria-label="Close"
          color="inherit"
          onClick={() => {
            setOpen(false);
          }}
          size="large"
        >
          <IconNavigationClose />
        </IconButton>
      </DialogTitle>
      <DialogContent classes={{root: classes.content}}>
        <DialogContentText id="about-description" tabIndex={-1}>
          <Typography component="h2" variant="subtitle1" className={classes.contentTitle}>
            The Potential for Electrification of Truck Fleets: a story map to highlight the new
            Google Maps vector capabilities
          </Typography>
          <Typography component="p" variant="body2" color="textPrimary">
            We have been working over the last few months to add rich visualization capabilities to
            Google Maps leveraging their new upcoming vector support. Now we have the{' '}
            <Link underline="always" href="https://carto.com" target="_blank">
              technology
            </Link>{' '}
            ready and we are looking at different angles to showcase the capabilities.
          </Typography>
          <div className={classes.logos}>
            <CoverLogoBlock
              title="A story map by"
              textClassName={classes.logosText}
              images={[
                {
                  src: cartoLogo,
                  alt: 'CARTO'
                }
              ]}
            />
            <CoverLogoBlock
              title="In collaboration with"
              textClassName={classes.logosText}
              images={[
                {
                  src: googleMapsLogo,
                  alt: 'Google Maps'
                }
              ]}
            />
          </div>
          <Paper classes={{root: classes.card}} elevation={0}>
            <div className={classes.cardText}>
              <Typography variant="overline" component="h4" className={classes.cardTextTitle}>
                How has this been made
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                Donec sed nibh porta, laoreet lacus vehicula, tincidunt ante. Mauris mollis aliquet
                urna. Vestibulum vulputate in tellus eu egestas.
              </Typography>
              <div className={classes.cardTextButtons}>
                <Button
                  href="https://carto.com"
                  component="a"
                  target="_blank"
                  variant="contained"
                  size="small"
                  color="primary"
                >
                  Read the full post
                </Button>
                <Button
                  href="https://carto.com"
                  component="a"
                  target="_blank"
                  size="small"
                  color="primary"
                  startIcon={<IconGithub />}
                >
                  Check our GitHub
                </Button>
              </div>
            </div>
          </Paper>
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
};

export default forwardRef(About);
