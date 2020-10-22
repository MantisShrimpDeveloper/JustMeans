import './CreateUser.css'

import React from 'react';
import Grid from '@material-ui/core/Grid';
import { Input } from '../../tools/Input.js';
import { Button } from '../../tools/Button.js';
import { Link, Redirect } from "react-router-dom";
import { TitleComponent } from '../../TitleComponent.jsx';
import Popup from "reactjs-popup";

const url = 'http://localhost:5000'

export default function CreateUser() {

  const [username, setUsername] = React.useState("");
  const [passphrase1, setPassphrase1] = React.useState("");
  const [passphrase2, setPassphrase2] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [createError, setCreateError] = React.useState(false);
  const [errorPhrase, setErrorPhrase] = React.useState("No error");
  const [created, setCreated] = React.useState(false);


  const handleEnter = async () => {
    const params = {username, passphrase1, passphrase2 };
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
        setErrorPhrase("Login Error: " + result['status']);
        setCreateError(true);
      }
    });
  }

  if (created)
    return (<Redirect to='/dashboard'/>);

  return (
    <div>
      <TitleComponent title='Create User'/>
      <Popup trigger={null} modal open={createError}>
        {errorPhrase}
      </Popup>
      <Grid container className='page' direction='column' alignItems='center' justify='center'>
        <Grid item className='body'>
          <Grid container direction='column' spacing={2}>
            <Grid item className='title'>
              <h2>
                Create User
              </h2>
            </Grid>
            <Grid item>
              <Input
                id={'username'}
                label='Username'
                locked={false}
                active={false}
                hidden={false}
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
                id={'passphrase-1'}
                label='Passphrase 1'
                locked={false}
                active={false}
                hidden={true}
                changeValueMethod={setPassphrase1}
                enterMethod={handleEnter}
              />
            </Grid>
            <Grid item>
              <Input
                id={'passphrase-2'}
                label='Passphrase 2'
                locked={false}
                active={false}
                hidden={true}
                changeValueMethod={setPassphrase2}
                enterMethod={handleEnter}
              />
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