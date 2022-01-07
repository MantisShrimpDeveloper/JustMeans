import './Dashboard.css'

import React, { useEffect } from "react";
import Grid from '@material-ui/core/Grid';
import { IconButton } from '../../tools/IconButton.js';
import { Input } from '../../tools/Input.js';
import { useCookies } from 'react-cookie';
import { TitleComponent } from '../../TitleComponent.jsx';
import { url } from '../common.js';

var forge = require('node-forge');

const fakeConversations = {'Serrena': {'10:07':['wat u doin?', 1], '10:09': ['nuthin much, u?', 0], '11:39': ['eating dinner', 1], '11:47': ['why you no text me early', 0]},
                           'Mark': {'10:07':['wat u doin?', 1], '10:09': ['nuthin much, u?', 0], '11:39': ['eating dinner', 1], '11:47': ['what are you eating', 0]}}

var operations = [];
var otherUsernames = [];

function ConversationBox({person, clickMethod}) {
  return <div onClick={() => clickMethod(person)} className='conversation-box'>
    <Grid container direction='column'>
      <Grid item className='conversation-box-title'>
        {person}
      </Grid>
      <Grid item className='conversation-box-text'>
        {fakeConversations[person]['11:47']}
      </Grid>
    </Grid>
  </div>
}

function TextBox({person, time}) {
  return <div className='conversation-box'>
    <Grid container alignItems={(fakeConversations[person][time][1] == 0) ? 'flex-end' : 'flex-start'} direction='column'>
      <Grid item className='conversation-box-title'>
        {time}
      </Grid>
      <Grid item className='conversation-box-text'>
        {fakeConversations[person][time]}
      </Grid>
    </Grid>
  </div>
}

export default function Dashboard() {

  const [cookies, setCookie] = useCookies(['sessionID', 'username']);
  const [currentConvo, setCurrentConvo] = React.useState('Serrena');
  const [message, setMessage] = React.useState(null);
  const [trusts, setTrusts] = React.useState([]);
  const [allUsers, setAllUsers] = React.useState([]);
  const [userSearch, setUserSearch] = React.useState("");
  const [trustRequests, setTrustRequests] = React.useState([]);
  const [addingTrusts, setAddingTrusts] = React.useState('false');

  React.useEffect(() => {
    console.log(operations)
    if (operations.length > 0) {
      var op = operations.splice(0, 1)[0]
      console.log(op)
      var otherUsername = otherUsernames.splice(0, 1)[0]
      switch(op) {
        case 'accept':
          acceptTrust(otherUsername);
          break;
        case 'decline':
          declineTrust(otherUsername);
          break;
        case 'remove':
          removeTrust(otherUsername);
          break;
        case 'ask':
          askTrust(otherUsername);
          break;
        default:
          update();
          break;
      }
    } else {
      update();
    }
  }, [message]);

  React.useEffect(() => {
    searchUsers();
  }, [userSearch]);

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
      if (result['status'] != null && result['status'] === "success") {
        setMessage(forge.util.hexToBytes(result['message']));
      }
    });
  }

  const update = async () => {
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
    const response = await fetch(url + '/update', requestOptions);
    const result = await response.json()
    .then(result => {
      if (result['status'] != null && result['status'] === "success") {
        setTrusts(result['trusts'])
        setTrustRequests(result['trust_requests'])
      }
      if (result['message'] != null) {
        setMessage(forge.util.hexToBytes(result['message']));
      }
    });
  }

  const queueUp = (operation, otherUsername) => {
    otherUsernames.push(otherUsername)
    operations.push(operation);
  }

  const searchUsers = async () => {
    const partial_username = userSearch;
    const params = {partial_username};
    console.log(params);
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    };
    const response = await fetch(url + '/username-search', requestOptions);
    const result = await response.json()
    .then(result => {
      console.log(result)
      if (result['status'] != null && result['status'] === "success") {
        setAllUsers(result['usernames'])
      }
    });
  }

  const acceptTrust = async (otherUsername) => {
    const sessionID = forge.util.bytesToHex(cookies['sessionID'])
    const username = cookies['username']
    var md = forge.md.sha512.create();
    md.update(message);
    var privateKey = forge.pki.privateKeyFromPem(localStorage.getItem('privateKey'))
    var signature = forge.util.bytesToHex(privateKey.sign(md));
    const params = {sessionID, signature, username, otherUsername};
    console.log(params);
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    };
    const response = await fetch(url + '/accept-trust', requestOptions);
    const result = await response.json()
    .then(result => {
      console.log(result)
      if (result['message'] != null) {
        setMessage(forge.util.hexToBytes(result['message']));
      }
    });
  }

  const declineTrust = async (otherUsername) => {
    const sessionID = forge.util.bytesToHex(cookies['sessionID'])
    const username = cookies['username']
    var md = forge.md.sha512.create();
    md.update(message);
    var privateKey = forge.pki.privateKeyFromPem(localStorage.getItem('privateKey'))
    var signature = forge.util.bytesToHex(privateKey.sign(md));
    const params = {sessionID, signature, username, otherUsername};
    console.log(params);
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    };
    const response = await fetch(url + '/decline-trust', requestOptions);
    const result = await response.json()
    .then(result => {
      console.log(result)
      if (result['message'] != null) {
        setMessage(forge.util.hexToBytes(result['message']));
      }
    });
  }

  const askTrust = async (otherUsername) => {
    const sessionID = forge.util.bytesToHex(cookies['sessionID'])
    const username = cookies['username']
    var md = forge.md.sha512.create();
    md.update(message);
    var privateKey = forge.pki.privateKeyFromPem(localStorage.getItem('privateKey'))
    var signature = forge.util.bytesToHex(privateKey.sign(md));
    const params = {sessionID, signature, username, otherUsername};
    console.log(params);
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    };
    const response = await fetch(url + '/ask-trust', requestOptions);
    const result = await response.json()
    .then(result => {
      console.log(result)
      if (result['message'] != null) {
        setMessage(forge.util.hexToBytes(result['message']));
      }
    });
  }

  const removeTrust = async (otherUsername) => {
    const sessionID = forge.util.bytesToHex(cookies['sessionID'])
    const username = cookies['username']
    var md = forge.md.sha512.create();
    md.update(message);
    var privateKey = forge.pki.privateKeyFromPem(localStorage.getItem('privateKey'))
    var signature = forge.util.bytesToHex(privateKey.sign(md));
    const params = {sessionID, signature, username, otherUsername};
    console.log(params);
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    };
    const response = await fetch(url + '/remove-trust', requestOptions);
    const result = await response.json()
    .then(result => {
      console.log(result)
      if (result['message'] != null) {
        setMessage(forge.util.hexToBytes(result['message']));
      }
    });
  }

  const toggleAddingTrusts = () => {
    if(addingTrusts == 'false')
      setAddingTrusts('true');
    else
      setAddingTrusts('false');
  }

  if(message == null) requestAuthentication();
  
  return (
    <div className='background'>
      <TitleComponent title='Dashboard'/>
      <Grid container direction='row' className='height-fix'>
        <Grid item xs={3} className='conversation-panel'>
          {(addingTrusts == 'true') ? (
            <div className='height-fix-w-panel'>
              <Grid container direction='column' className='height-fix'>
                <DataBlock title={'All Users'} searchbar searchEnter={searchUsers} searchValue={setUserSearch} data={allUsers} queueUp={queueUp} left={{value:'check', onClick:'ask'}} right={{value:'ex'}}/>
              </Grid>
              <div className='tab-switcher'>
                <IconButton value='minus' onClick={toggleAddingTrusts}/>
              </div>
            </div>
          ) : (
            <div className='height-fix-w-panel'>
              <Grid container direction='column' className='height-fix'>
                <DataBlock title={'Trusted Users'} data={trusts} queueUp={queueUp} left={{value:'msg'}} right={{value:'ex', onClick:'remove'}}/>
                <DataBlock title={'Trust Requests'} data={trustRequests} queueUp={queueUp} left={{value:'check', onClick:'accept'}} right={{value:'ex', onClick:'decline'}}/>
              </Grid>
              <div className='tab-switcher'>
                <IconButton value='plus' onClick={toggleAddingTrusts}/>
              </div>
            </div>
          )}
        </Grid>
        <Grid item xs={3} className='conversation-panel'>
          <Grid container direction='column' className='height-fix'>
            <DataBlock title={'Conversations'} data={['mark', 'james', 'margaret']} left={{value:'msg'}} right={{value:'ex'}}/>
            <DataBlock title={'Conversation Requests'} data={['mark', 'james', 'margaret']} left={{value:'check'}} right={{value:'ex'}}/>
          </Grid>
        </Grid>
        <Grid item xs={6} className='conversation-panel'>
          <Grid container direction='column' className='height-fix'>
            <Grid item className='data-block-title'>
                {currentConvo}
            </Grid>
            <Grid item className='data-block-content'>
              <Grid container direction='column'>
                {Object.keys(fakeConversations[currentConvo]).map(d => {
                  return (
                    <Grid item>
                      <TextBox person={currentConvo} time={d}/>
                    </Grid>
                  );
                })}
                {Object.keys(fakeConversations[currentConvo]).map(d => {
                  return (
                    <Grid item>
                      <TextBox person={currentConvo} time={d}/>
                    </Grid>
                  );
                })}
                {Object.keys(fakeConversations[currentConvo]).map(d => {
                  return (
                    <Grid item>
                      <TextBox person={currentConvo} time={d}/>
                    </Grid>
                  );
                })}
                {Object.keys(fakeConversations[currentConvo]).map(d => {
                  return (
                    <Grid item>
                      <TextBox person={currentConvo} time={d}/>
                    </Grid>
                  );
                })}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}

function DataBlock({title, data, searchbar, searchEnter, searchValue, queueUp, left, right}) {
  return (
    <Grid item className={(searchbar) ? 'data-block-w-search' : 'data-block'}>
      <Grid container direction='column' alignItems='center' justify='space-between' className='height-fix'>
        <Grid item className='data-block-title'>
            {title}
        </Grid>
        {(searchbar) ? (
          <Grid item className='searchbar'>
            <Input
              id={'Search All Users'}
              label="search"
              locked={false}
              active={false}
              hidden={false}
              enterMethod={searchEnter}
              changeValueMethod={searchValue}
            />
          </Grid>
        ) : (
          null
        )}
        <Grid item className={(searchbar) ? 'data-block-content-w-search' : 'data-block-content'}>
          <Grid container direction='column'>
            {data.map(d => {
              return (
                <DataBox data={d} queueUp={queueUp} left={left} right={right}/>
              );
            })}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

function DataBox({data, queueUp, left, right}) {
  const leftClick = () => {
    queueUp(left.onClick, data);
  }
  const rightClick = () => {
    queueUp(right.onClick, data);
  }

  return (
    <Grid item className='data-box'>
      <Grid container direction='row'>
        <Grid item xs={8}>
          {data}
        </Grid>
        <Grid item xs={4}>
          <Grid container direction='row' justify='center'>
            <Grid item>
              <IconButton value={left.value} onClick={leftClick}/>
            </Grid>
            <Grid item>
              <IconButton value={right.value} onClick={rightClick}/>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}