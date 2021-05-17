import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import colors from './design/tools.js';

import BackIcon from './design/icons/back_arrow.svg';
import SettingsIcon from './design/icons/settings.svg';
//import AnonIcon from './design/icons/anon_circle.svg';

export default function Header({title}) {

  return (
    <View style={styles.header}>
      <Text style={styles.title}>
        {title}
      </Text>
    </View>
  );
}

export function BackButton({nav, page}) {

  return (
    <TouchableOpacity onPress={() => nav(page)} style={styles.button}>
      <BackIcon height={50} width={50}/>
    </TouchableOpacity>
  );
};

export function BlankButton() {

  return (
    <View style={styles.button}/>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 40,
    color: colors.purple,
  },
  button: {
    height: 50,
    width: 50,
  },
});