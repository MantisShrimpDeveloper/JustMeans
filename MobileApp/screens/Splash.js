import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

import colors from '../design/tools.js';

import AddIcon from '../design/icons/add_circle.svg';
import UserIcon from '../design/icons/user_circle.svg';
import AnonIcon from '../design/icons/anon_circle.svg';
import CreateUser from './CreateUser.js';


export default function Splash({navigation}) {
  return (
    <View style={styles.page}>
      <TouchableOpacity style={styles.option}>
        <AnonIcon width={80} height={80}/>
        <Text style={styles.optionText}>
          Anonymous Login
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.option}>
        <UserIcon width={80} height={80}/>
        <Text style={styles.optionText}>
          User Login
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.option} onPress={() => navigation.navigate(CreateUser)}>
        <AddIcon width={80} height={80}/>
        <Text style={styles.optionText}>
          Create User
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex:1,
    flexDirection:'column',
    backgroundColor: colors.grey,
    alignItems: 'center',
    justifyContent: 'center',
  },
  option: {
    height: 120,
    flexDirection:'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionText: {
    textAlign: 'center',
    width: 250,
    color: colors.purple,
    fontSize: 30,
  },
});