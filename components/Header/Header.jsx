import React from 'react';
import {Button, IconButton, Drawer, makeStyles, Fade} from '@material-ui/core';
import {ReactComponent as IconActionHelp} from '../../assets/icons/icon-action-help-outline.svg';
import {ReactComponent as IconSocialShare} from '../../assets/icons/icon-social-share.svg';

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'absolute',
    top: 0,
    right: 0,
    margin: theme.spacing(3),
    display: 'flex',
    justifyContent: 'flex-end',
    zIndex: 2,
    transition: ({showDelay}) =>
      theme.transitions.create('opacity', {
        easing: theme.transitions.easing.linear,
        duration: 0,
        delay: showDelay
      }),
    '&[data-hidden="true"]': {
      pointerEvents: 'none',
      opacity: 0,
      transition: ({hideDelay}) =>
        theme.transitions.create('opacity', {
          easing: theme.transitions.easing.linear,
          duration: 0,
          delay: hideDelay
        })
    }
  },
  rootPrimary: {
    color: theme.palette.primary.main,
    '& svg path': {
      fill: theme.palette.primary.main
    }
  },
  rootWhite: {
    color: theme.palette.common.white,
    '& svg path': {
      fill: theme.palette.common.white
    }
  },
  btn: {
    marginLeft: theme.spacing(1)
  }
}));

const Header = ({primary, hidden, showDelay = 0, hideDelay = 0, className}) => {
  const classes = useStyles({showDelay, hideDelay});

  return (
    <div
      data-hidden={!!hidden}
      className={[
        classes.root,
        primary ? classes.rootPrimary : classes.rootWhite,
        className ? className : ''
      ].join(' ')}
    >
      <Button
        data-position="right"
        classes={{root: classes.btn, colorInherit: classes.btnWhite}}
        color={primary ? 'primary' : 'inherit'}
        onClick={() => {}}
        startIcon={<IconActionHelp />}
        size="small"
      >
        About
      </Button>
      <Button
        data-position="right"
        classes={{root: classes.btn, colorInherit: classes.btnWhite}}
        color={primary ? 'primary' : 'inherit'}
        onClick={() => {}}
        startIcon={<IconSocialShare />}
        size="small"
      >
        Share
      </Button>
    </div>
  );
};

export default Header;
