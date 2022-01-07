import './Login.css'

import React from 'react';
import Grid from '@material-ui/core/Grid';
import { useCookies } from 'react-cookie';
import { Input } from '../../tools/Input.js';
import { Button } from '../../tools/Button.js';
import { Link, Redirect } from "react-router-dom";
import { TitleComponent } from '../../TitleComponent.jsx';
import { url } from '../common.js';

var forge = require('node-forge');

export default function Login() {

  const [username, setUsername] = React.useState("");
  const [passphrase1, setPassphrase1] = React.useState("");
  const [passphrase2, setPassphrase2] = React.useState("");
  const [entropy, setEntropy] = React.useState("");

  const [publicKey, setPublicKey] = React.useState("");

  const [userError, setUserError] = React.useState("");

  const [devicename, setDevicename] = React.useState("");
  const [loggedIn, setLoggedIn] = React.useState(false);

  const [cookies, setCookie] = useCookies(['sessionID']);

  const isFirstCreateDevice = React.useRef(true)
  React.useEffect(() => {
    if (isFirstCreateDevice.current) {
      isFirstCreateDevice.current = false;
      return;
    }
    createDevice();
  }, [publicKey]);

  const isFirstLogin = React.useRef(true)
  React.useEffect(() => {
    if (isFirstLogin.current) {
      isFirstLogin.current = false;
      return;
    }
    login();
  }, [devicename]);

  const generateKeypair = async () => {
    var rsa = forge.pki.rsa;
    var keyPair = rsa.generateKeyPair({bits: 2048, e: 0x10001});

    localStorage.setItem('privateKey', forge.pki.privateKeyToPem(keyPair.privateKey))
    setPublicKey(keyPair.publicKey);
  }

  const createDevice = async () => {
    var web = true;
    const params = {username, passphrase1, passphrase2, devicename, publicKey:forge.pki.publicKeyToRSAPublicKeyPem(publicKey), web };
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    };
    const response = await fetch(url + '/create-device', requestOptions);
    const result = await response.json()
    .then(result => {
      if (result['status'] != null && result['status'] === "success") {
        setDevicename(result['devicename']);
      }else{
        setUserError(result['error']);
      }
    });
  }

  const login = async () => {
    const params = {username, passphrase1, passphrase2, devicename};
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    };
    const response = await fetch(url + '/login', requestOptions);
    const result = await response.json()
    .then(result => {
      if (result['status'] != null && result['status'] === "success") {
        setCookie('username', username);
        if (result['sessionID'] != null) {
          console.log(result['sessionID'])
          setCookie('sessionID', forge.util.hexToBytes(result['sessionID']));
          setLoggedIn(true);
        } else {
          setUserError("no sessionID was returned from login");
        }
      }else{
        setUserError(result['error']);
      }
    });
  }

  const handleUserLogin = async () => {
    generateKeypair();
  }

  if (loggedIn)
    return (<Redirect to='/dashboard'/>);
  
  return (
    <div>
      <TitleComponent title='Login'/>
      <Grid container className='page' direction='column' alignItems='center' justify='center'>
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
              <Input
                id={'entropy'}
                label='Entropy'
                locked={false}
                active={false}
                hidden={true}
                enterMethod={handleUserLogin}
                changeValueMethod={setEntropy}
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
    </div>
  );
}