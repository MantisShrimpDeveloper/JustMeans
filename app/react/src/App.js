import React from 'react';
import './App.css';
import Header from './header/Header.js'
import Home from './pages/home/Home.js'
import Downloads from './pages/downloads/Downloads.js'
import Login from './pages/login/Login.js'
import Logout from './pages/logout/Logout.js'
import About from './pages/about/About.js'
import CreateUser from './pages/create-user/CreateUser.js'
import Dashboard from './pages/dashboard/Dashboard.js'
import { BrowserRouter, Switch, Route, } from "react-router-dom";
import { CookiesProvider } from 'react-cookie';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Header/>
        <CookiesProvider>
          <Switch>
            <Route path='/downloads'>
              <Downloads/>
            </Route>
            <Route path='/about'>
              <About/>
            </Route>
            <Route path='/login'>
              <Login/>
            </Route>
            <Route path='/logout'>
              <Logout/>
            </Route>
            <Route path='/create-user'>
              <CreateUser/>
            </Route>
            <Route path='/dashboard'>
              <Dashboard/>
            </Route>
            <Route exact path='/'>
              <Home/>
            </Route>
          </Switch>
        </CookiesProvider>
      </div>
    </BrowserRouter>
  );
}

export default App;
