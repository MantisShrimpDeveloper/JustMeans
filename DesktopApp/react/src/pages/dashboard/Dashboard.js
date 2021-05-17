import './Dashboard.css'

import React from "react";
import Grid from '@material-ui/core/Grid';
import { useCookies } from 'react-cookie';
import { TitleComponent } from '../../TitleComponent.jsx';

const fakeConversations = {'Serrena': {'10:07':['wat u doin?', 1], '10:09': ['nuthin much, u?', 0], '11:39': ['eating dinner', 1], '11:47': ['why you no text me early', 0]},
                           'Mark': {'10:07':['wat u doin?', 1], '10:09': ['nuthin much, u?', 0], '11:39': ['eating dinner', 1], '11:47': ['what are you eating', 0]}}

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

  const [cookies, setCookie] = useCookies(['username']);
  const [currentConvo, setCurrentConvo] = React.useState('Serrena');

  return (
    <div>
      <TitleComponent title='Dashboard'/>
        <Grid container direction='row' className='height-fix'>
          <Grid item id='trustedUsers' xs={3}>
            <Grid container direction='column' className='conversation-block'>
              <Grid item className='conversation-block-title'>
                Trusted Users
              </Grid>
            </Grid>
          </Grid>
          <Grid item id='conversations' xs={3}>
            <Grid container direction='column' className='conversation-block'>
              <Grid item className='conversation-block-title'>
              {cookies.username + "'s Conversations"}
              </Grid>
              {Object.keys(fakeConversations).map(p => {
                return (
                  <Grid item>
                      <ConversationBox person={p} clickMethod={setCurrentConvo}/>
                  </Grid>
                );
              })}
            </Grid>
          </Grid>
          <Grid item id='feed' xs={6}>
            <Grid container direction='column' className='conversation-block'>
              <Grid item className='conversation-block-title'>
                {currentConvo}
              </Grid>
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
      </div>
  );
}