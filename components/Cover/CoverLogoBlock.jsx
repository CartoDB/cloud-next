import React from 'react';
import {Typography, makeStyles} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    '& + $root': {
      marginLeft: theme.spacing(7)
    }
  },
  text: {
    marginBottom: theme.spacing(3)
  },
  logos: {
    display: 'flex',
    alignItems: 'center',
    '& img + img': {
      marginLeft: theme.spacing(7)
    }
  }
}));

const CoverLogoBlock = ({title, images, textClassName}) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Typography
        component="h5"
        variant="caption"
        className={[classes.text, textClassName ? textClassName : ''].join(' ')}
        color="inherit"
      >
        {title}
      </Typography>
      <div className={classes.logos}>
        {images.map(({src, alt, className}, i) => (
          <img key={`image-${i}`} {...(!!className && {className})} src={src} alt={alt} />
        ))}
      </div>
    </div>
  );
};

export default CoverLogoBlock;
