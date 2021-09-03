import React from 'react';
import {IconButton, makeStyles} from '@material-ui/core';
import {useAppState} from '../../state';
import {ReactComponent as IconNavigationCloseWhite} from '../../assets/icons/icon-navigation-close.svg';

const useStyles = makeStyles((theme) => ({
  btnWhite: {
    '& svg path': {
      fill: theme.palette.common.white
    }
  }
}));

const SidebarClose = ({className, primary}) => {
  const classes = useStyles();
  const {reset} = useAppState();

  return (
    <IconButton
      classes={{root: className || '', colorInherit: classes.btnWhite}}
      aria-label="Previous"
      color={primary ? 'primary' : 'inherit'}
      onClick={reset}
      size="small"
    >
      <IconNavigationCloseWhite />
    </IconButton>
  );
};

export default SidebarClose;
