import React, {useRef} from 'react';
import {Button, makeStyles, ClickAwayListener} from '@material-ui/core';
import {ReactComponent as IconActionHelp} from '../../assets/icons/icon-action-help-outline.svg';
import {ReactComponent as IconSocialShare} from '../../assets/icons/icon-social-share.svg';
import About from '../About/About';
import Share from '../Header/Share';

export const HEADER_HEIGHT = 72;

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
  const shareRef = useRef();
  const rootRef = useRef();
  const classes = useStyles({showDelay, hideDelay});

  return (
    <div
      data-hidden={!!hidden}
      ref={rootRef}
      className={[
        classes.root,
        primary ? classes.rootPrimary : classes.rootWhite,
        className ? className : ''
      ].join(' ')}
    >
      <Button
        data-position="right"
        component="a"
        href="#about"
        classes={{root: classes.btn, colorInherit: classes.btnWhite}}
        color={primary ? 'primary' : 'inherit'}
        startIcon={<IconActionHelp />}
        size="small"
      >
        About
      </Button>
      <ClickAwayListener onClickAway={shareRef?.current ? shareRef.current.hide : () => {}}>
        <Button
          data-position="right"
          classes={{root: classes.btn, colorInherit: classes.btnWhite}}
          color={primary ? 'primary' : 'inherit'}
          onClick={shareRef?.current ? shareRef.current.show : () => {}}
          startIcon={<IconSocialShare />}
          size="small"
        >
          Share
        </Button>
      </ClickAwayListener>

      <About />
      <Share anchorEl={rootRef?.current} ref={shareRef} />
    </div>
  );
};

export default Header;
