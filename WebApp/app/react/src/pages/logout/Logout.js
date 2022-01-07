import React from "react";
import { TitleComponent } from '../../TitleComponent.jsx';
import { Redirect } from "react-router-dom";
import { useCookies } from 'react-cookie';
import { url } from '../common.js';

var forge = require('node-forge');

export default function Logout() {

  const [cookies, setCookie, removeCookie] = useCookies(['username', 'sessionID']);
  const [loggedOut, setLoggedOut] = React.useState(false);
  const [message, setMessage] = React.useState(null);

  React.useEffect(() => {
    handleUserLogout();
  }, [message]);

  const requestAuthentication = async () => {
    const sessionID = forge.util.bytesToHex(cookies['sessionID'])
    const params = {sessionID};
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    };
    const response = await fetch(url + '/request-authentication', requestOptions);
    const result = await response.json()
    .then(result => {
      console.log(result)
      if (result['status'] != null && result['status'] === "success") {
        setMessage(forge.util.hexToBytes(result['message']));
      }
    });
  }

  const handleUserLogout = async () => {
    const sessionID = forge.util.bytesToHex(cookies['sessionID'])
    var md = forge.md.sha512.create();
    md.update(message);
    var privateKey = forge.pki.privateKeyFromPem(localStorage.getItem('privateKey'))
    var signature = forge.util.bytesToHex(privateKey.sign(md));
    const params = {sessionID, signature};
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    };
    const response = await fetch(url + '/logout', requestOptions);
    const result = await response.json()
      .then(result => {
        removeCookie('username');
        removeCookie('sessionID');
        setLoggedOut(true);
      });
  }

  requestAuthentication();

  if (loggedOut)
    return (<Redirect to='/'/>);

  return (
    <div>
      <TitleComponent title='Logout'/>
      Logging out...
    </div>
  );
}