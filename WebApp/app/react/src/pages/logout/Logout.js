import React from "react";
import { TitleComponent } from '../../TitleComponent.jsx';
import { Redirect } from "react-router-dom";
import { useCookies } from 'react-cookie';


const url = 'http://localhost:5000'

export default function Logout() {

  const [cookies, setCookie, removeCookie] = useCookies(['username']);
  const [loggedOut, setLoggedOut] = React.useState(false);

  const handleUserLogout = async () => {
    const params = {'username': cookies.username };
    console.log(JSON.stringify(params))
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    };
    const response = await fetch(url + '/logout-web-user', requestOptions);
    const result = await response.json()
      .then(result => {
        removeCookie('username');
        setLoggedOut(true);
      });
  }

  handleUserLogout();

  if (loggedOut)
    return (<Redirect to='/'/>);

  return (
    <div>
      <TitleComponent title='Logout'/>
      Logging out
    </div>
  );
}