import './Footer.css'

import React from "react";
import Grid from '@material-ui/core/Grid';
import { Link } from "react-router-dom";

export default function Header() {

  return (
      <Grid container direction='row' justify='space-between' alignItems='center' className='footer'>
        <Grid item>
          <Link to='/license' className='footer-link'>
            GNU GENERAL PUBLIC LICENSE
          </Link>
        </Grid>
        <Grid item className='donate'>
          Care to donate? Bitcoin Address: ADDRESS
        </Grid>
      </Grid>
  );
}