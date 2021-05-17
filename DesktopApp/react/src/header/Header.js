import './Header.css'

import React from "react";
import Grid from '@material-ui/core/Grid';
import { Link } from "react-router-dom";
import { useCookies } from 'react-cookie';


export default function Header() {

  const [cookies, setCookie] = useCookies(['username']);

  return (
    <div className='header'>
      <Grid container direction='row' justify='space-between' alignItems='center'>
        <Grid item>
          <Link to='/' className='site-title'/>
        </Grid>
        <Grid item>
          <Grid container direction='row' spacing={4}>
            <Grid item>
              { (cookies.username == null) ?
                (<Link to='/login' className='header-link'>
                  Log In
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