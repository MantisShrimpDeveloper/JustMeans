import './CreateUser.css'

import React from 'react';
import Grid from '@material-ui/core/Grid';
import { Input } from '../../tools/Input.js';
import { Button } from '../../tools/Button.js';
import { Link, Redirect } from "react-router-dom";
import { TitleComponent } from '../../TitleComponent.jsx';
import { url } from '../common.js';

var RandomWords = require('random-words');

export default function CreateUser() {

  const [username, setUsername] = React.useState("");
  const [passphrase1, setPassphrase1] = React.useState("");
  const [passphrase2, setPassphrase2] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [created, setCreated] = React.useState(false);
  const [error, setError] = React.useState("");

  const passphrase2ref = React.useRef();

  const handleEnter = async () => {
    const params = {username, passphrase1, passphrase2, email };
    console.log(JSON.stringify(params))
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    };
    const response = await fetch(url + '/create-user', requestOptions);
    const result = await response.json()
    .then(result => {
      if (result['status'] != null && result['status'] === "success") {
        setCreated(true);
      }else{
        setError(result['error']);
      }
    });
  }

  const randomCaps = (word) => {
    var choice = Math.floor(Math.random() * 4);
    switch(choice){
      case 0: return word.toUpperCase();
      case 1: return word.toLowerCase();
      default:
        var ret = "";
        for(var i = 0; i < word.length; i++){
          if((i + choice) % 2 === 0)
            ret += word.charAt(i).toUpperCase();
          else
          ret += word.charAt(i).toLowerCase();
        }
        return ret;
    }
  }

  const generatePassphrase2 = () => {
    var beforeCaps = RandomWords({exactly: 4})
    var p2 = ''
    for(var i = 0; i < 4; i++) {
      p2 += randomCaps(beforeCaps[i])
      if(i < 3)
        p2 += ' '
    }
    setPassphrase2(p2)
    passphrase2ref.current.setState({value: p2})
  }

  const newUsernameCheck = (username) => {
    if (username.length > 64)
      return "over 64 characters";
    if (username.length < 8)
      return "under 8 characters";
    return "";
  }

  const SYMBOLS = [' ', '!', '"', '#', '$', '%', '&', '\'', '(', ')', '*', '+', ',', '-', '.', '/', ':', ';', '<', '=', '>', '?', '@', '[', '\\', ']', '^', '_', '`', '{', '|', '}', '~'];
  const NUMBERS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

  const newPassphrase1Check = (passphrase) => {
    if (passphrase === passphrase.toUpperCase())
      return "missing lowercase letter";
    if (passphrase === passphrase.toLowerCase())
      return "missing uppercase letter";

    var hasNumber = false;
    for (var i = 0; i < NUMBERS.length; i++)
      if (passphrase.indexOf(NUMBERS[i]) > -1)
        hasNumber = true;
    if (!hasNumber)
      return "missing number";

    var hasSymbol = false;
    for (i = 0; i < SYMBOLS.length; i++)
      if (passphrase.indexOf(SYMBOLS[i]) > -1)
        hasSymbol = true;
    if (!hasSymbol)
      return "missing symbol";

    if (passphrase.length > 128)
      return "too long";
    if (passphrase.length < 8)
      return "too short";
    return "";
  }

  const newPassphrase2Check = (passphrase) => {
    if (passphrase.length > 128)
      return "too long";
    if (passphrase.length < 8)
      return "too short";
    return "";
  }

  if (created)
    return (<Redirect to='/login'/>);

  return (
    <div>
      <TitleComponent title='Create User'/>
      <Grid container className='page' direction='column' alignItems='center' justify='center'>
        <Grid item className='body'>
          <Grid container direction='column' spacing={2}>
            <Grid item className='center'>
              <h2>
                Create User
              </h2>
            </Grid>
            {
              error === "" ? (
                null
              ) : (
                <Grid item className='center'>
                  <h3>
                  {error}
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
                errorMethod={newUsernameCheck}
                changeValueMethod={setUsername}
                enterMethod={handleEnter}
              />
            </Grid>
            <Grid item>
              <Input
                id={'email'}
                label='Email Address'
                locked={false}
                active={false}
                hidden={false}
                changeValueMethod={setEmail}
                enterMethod={handleEnter}
              />
            </Grid>
            <Grid item>
              <Input
                id={'passphrase1'}
                label='Passphrase 1'
                locked={false}
                active={false}
                hidden={true}
                errorMethod={newPassphrase1Check}
                changeValueMethod={setPassphrase1}
                enterMethod={handleEnter}
              />
            </Grid>
            <Grid item>
              <Grid container direction='row' spacing={2}>
                <Grid item xs={9}>
                  <Input
                    id={'passphrase2'}
                    label='Passphrase 2'
                    locked={false}
                    active={false}
                    hidden={false}
                    errorMethod={newPassphrase2Check}
                    changeValueMethod={setPassphrase2}
                    enterMethod={handleEnter}
                    ref={passphrase2ref}
                  />
                </Grid>
                <Grid item xs={3}>
                  <Button
                    value='Generate'
                    onClick={generatePassphrase2}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <Grid container direction='row' spacing={2}>
                <Grid item xs={6}>
                  <Link to='/login'>
                    <Button
                      value='Back To Login'
                    />
                  </Link>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    value='Create User'
                    onClick={handleEnter}
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