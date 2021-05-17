import './Login.css'

import React from 'react';
import Grid from '@material-ui/core/Grid';
import { useCookies } from 'react-cookie';
import { Input } from '../../tools/Input.js';
import { Button } from '../../tools/Button.js';
import { Link, Redirect } from "react-router-dom";
import { TitleComponent } from '../../TitleComponent.jsx';

const url = 'http://localhost:5000'

export default function Login() {

  const [username, setUsername] = React.useState("");
  const [passphrase1, setPassphrase1] = React.useState("");
  const [passphrase2, setPassphrase2] = React.useState("");
  const [userError, setUserError] = React.useState("");

  const [anonname, setAnonname] = React.useState("");
  const [anonError, setAnonError] = React.useState("");

  const [loggedIn, setLoggedIn] = React.useState(false);

  const [cookies, setCookie] = useCookies(['username']);

  const handleUserLogin = async () => {
    const params = {username, passphrase1, passphrase2 };
    console.log(JSON.stringify(params))
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    };
    const response = await fetch(url + '/login-web-user', requestOptions);
    const result = await response.json()
    .then(result => {
      if (result['status'] != null && result['status'] === "success") {
        setCookie('username', username);
        setLoggedIn(true);
      }else{
        setUserError(result['status']);
      }
    });
  }

  const handleAnonymousLogin = async () => {
    setAnonError("Coming Soon!");
    /*
    const params = {type:'anonymous', anonname};
    console.log(JSON.stringify(params))
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    };
    const response = await fetch(url + '/create-anonymous', requestOptions);
    const result = await response.json()
    .then(result => {
      if (result['login-status'] === "success") {
        setLoggedIn(true);
      }else{
        console.log('failed')
        setLoginError(true);
      }
    });*/
  }

  if (loggedIn)
    return (<Redirect to='/dashboard'/>);
  
  return (
    <div>
      <TitleComponent title='Login'/>
      <Grid container className='page' direction='column' alignItems='center' justify='center'>
        <Grid item>
          <Grid container direction='row' spacing={10}>
          <Grid item className='form'>
              <Grid container direction='column' spacing={2} justify='center'>
                <Grid item className='center'>
                  <h2>
                    Total Anonymity
                  </h2>
                </Grid>
                {
                  anonError == "" ? (
                    null
                  ) : (
                    <Grid item className='center'>
                      <h3>
                      {anonError}
                      </h3>
                    </Grid>
                  )
                }
                <Grid item>
                  <Input
                    id={'anonymous username'}
                    label='Username'
                    locked={false}
                    active={false}
                    hidden={false}
                    enterMethod={handleAnonymousLogin}
                    changeValueMethod={setAnonname}
                  />
                </Grid>
                <Grid item>
                  <Button
                    value='Start Anonymous Session'
                    onClick={handleAnonymousLogin}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item className='form'>
              <Grid container direction='column' spacing={2}>
                <Grid item className='center'>
                  <h2>
                    User Login
                  </h2>
                </Grid>
                {
                  userError == "" ? (
                    null
                  ) : (
                    <Grid item className='center'>
                      <h3>
                      {userError}
                      </h3>
                    </Grid>
                  )
                }
                <Grid item>
                  <Input
                    id={'username'}
                    label='Username'
                    locked={false}
                    active={false}
                    hidden={false}
                    enterMethod={handleUserLogin}
                    changeValueMethod={setUsername}
                  />
                </Grid>
                <Grid item>
                  <Input
                    id={'passphrase-1'}
                    label='Passphrase 1'
                    locked={false}
                    active={false}
                    hidden={true}
                    enterMethod={handleUserLogin}
                    changeValueMethod={setPassphrase1}
                  />
                </Grid>
                <Grid item>
                  <Input
                    id={'passphrase-2'}
                    label='Passphrase 2'
                    locked={false}
                    active={false}
                    hidden={true}
                    enterMethod={handleUserLogin}
                    changeValueMethod={setPassphrase2}
                  />
                </Grid>
                <Grid item>
                  <Grid container direction='row' spacing={2}>
                    <Grid item xs={6}>
                      <Link to='/create-user'>
                        <Button
                          value='Create User'
                        />
                      </Link>
                    </Grid>
                    <Grid item xs={6}>
                      <Button
                        value='Login'
                        onClick={handleUserLogin}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}