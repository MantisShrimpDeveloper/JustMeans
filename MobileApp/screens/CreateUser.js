import React from 'react';
import { StyleSheet, Text, View, TextInput } from 'react-native';
import colors from '../design/tools.js';

export default function CreateUser() {
  return (
      <View style={styles.page}>
      <TextInput defaultValue='Username'/>
      <TextInput defaultValue='Passphrase 1'/>
      <TextInput defaultValue='Passphrase 2'/>
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
});