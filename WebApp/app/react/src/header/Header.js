import './Header.css'

import React from "react";
import Grid from '@material-ui/core/Grid';
import { Link } from "react-router-dom";
import { useCookies } from 'react-cookie';

var forge = require('node-forge');

export default function Header() {

  const [cookies, setCookie] = useCookies(['sessionID']);

  return (
    <div className='header'>
      <Grid container direction='row' justify='space-between' alignItems='center' className='header-height'>
        <Grid item>
          <Link to='/' className='site-title'/>
        </Grid>
        <Grid item>
          <Grid container direction='row' spacing={4}>
            <Grid item>
              { (cookies.sessionID == null) ?
                (<Link to='/login' className='header-link'>
                  Start a Web Session
                </Link>) :
                (<Link to='/logout' className='header-link'>
                  Log Out
                </Link>)
              }
            </Grid>
            <Grid item>
              <Link to='/downloads' className='header-link'>
                Downloads
              </Link>
            </Grid>
            <Grid item>
              <Link to='/about' className='header-link'>
                About
              </Link>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}