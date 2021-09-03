import React, {forwardRef, useImperativeHandle, useState} from 'react';
import {makeStyles, Menu, MenuItem, ListItemIcon, ListItemText} from '@material-ui/core';
import {ReactComponent as IconFacebook} from '../../assets/icons/icon-facebook.svg';
import {ReactComponent as IconTwitter} from '../../assets/icons/icon-twitter.svg';
import {ReactComponent as IconLinkedin} from '../../assets/icons/icon-linkedin.svg';

const SHARING_URL = 'https://carto.com';
const SHARING_TEXT = 'Check out this CARTO BigQuery Google Maps example';

const useStyles = makeStyles((theme) => ({
  menu: {
    marginTop: theme.spacing(4.5),
    minWidth: theme.spacing(20)
  },
  icon: {
    marginLeft: 0,
    minWidth: theme.spacing(5)
  },
  text: {
    fontWeight: `400 !important`
  }
}));

const Share = ({anchorEl}, forwardedRef) => {
  const [open, setOpen] = useState(false);
  const classes = useStyles();

  useImperativeHandle(forwardedRef, () => ({
    show: () => {
      setOpen(true);
    },
    hide: () => {
      setOpen(false);
    }
  }));

  return (
    <Menu
      elevation={8}
      open={open}
      anchorEl={anchorEl}
      anchorOrigin={{
        horizontal: 'right'
      }}
      transformOrigin={{
        horizontal: 'right'
      }}
      classes={{
        paper: classes.menu
      }}
    >
      <MenuItem
        component="a"
        href={`https://www.facebook.com/sharer/sharer.php?u=${SHARING_URL}`}
        target="_blank"
      >
        <ListItemIcon classes={{root: classes.icon}}>
          <IconFacebook />
        </ListItemIcon>
        <ListItemText classes={{primary: classes.text}} primary="Facebook" />
      </MenuItem>
      <MenuItem
        component="a"
        href={`https://twitter.com/intent/tweet?url=${SHARING_URL}&text=${encodeURI(SHARING_TEXT)}`}
        target="_blank"
      >
        <ListItemIcon classes={{root: classes.icon}}>
          <IconTwitter />
        </ListItemIcon>
        <ListItemText classes={{primary: classes.text}} primary="Twitter" />
      </MenuItem>
      <MenuItem
        component="a"
        href={`https://www.linkedin.com/shareArticle?mini=true&url=${SHARING_URL}`}
        target="_blank"
      >
        <ListItemIcon classes={{root: classes.icon}}>
          <IconLinkedin />
        </ListItemIcon>
        <ListItemText classes={{primary: classes.text}} primary="Linkedin" />
      </MenuItem>
    </Menu>
  );
};

export default forwardRef(Share);
