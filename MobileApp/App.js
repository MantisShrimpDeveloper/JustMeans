import React from 'react';
import { StyleSheet, StatusBar, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import colors from './design/tools.js'

import Header from './Header.js'

import Conversations from './screens/Conversations.js'
import Profile from './screens/Profile.js'
import Users from './screens/Users.js'
import Splash from './screens/Splash.js'
import UserLogin from './screens/UserLogin.js'
import AnonymousLogin from './screens/AnonymousLogin.js'
import CreateUser from './screens/CreateUser.js'

Stack = createStackNavigator();

export default function App() {

  const [loggedIn, setLoggedIn] = React.useState(false);

  return (

      
      <NavigationContainer>
        <StatusBar barStyle='light-content'/>
        {
          loggedIn ? (
            <Stack.Navigator>
              <Stack.Screen name='Converstaions' component={Conversations}/>
              <Stack.Screen name='Profile' component={Profile}/>
              <Stack.Screen name='Users' component={Users}/>
            </Stack.Navigator>
          ) : (
            <Stack.Navigator>
              <Stack.Screen name='Splash' component={Splash} options={{headerStyle: {backgroundColor: colors.black}, headerTitle: props => <Header title='Just Means' {...props} /> }}/>
              <Stack.Screen name='UserLogin' component={UserLogin}/>
              <Stack.Screen name='AnonymousLogin' component={AnonymousLogin}/>
              <Stack.Screen name='CreateUser' component={CreateUser} options={{headerLeft: null, headerStyle: {backgroundColor: colors.black}, headerTitle: props => <Header title='Create User' leftButton='back' {...props} /> }}/>
            </Stack.Navigator>
          )
        }
      </NavigationContainer>

  );
}


const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: colors.grey,
    alignItems: 'stretch',
    justifyContent: 'space-between',
  },
});
