import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import colors from './design/tools.js';

import BackIcon from './design/icons/back_arrow.svg';
import SettingsIcon from './design/icons/settings.svg';
//import AnonIcon from './design/icons/anon_circle.svg';



export default function Header({title}, leftButton, rightButton}) {

  const leftIcon = () => {
    if(leftButton == null)
      return null;
    else if (leftButton == "back")
      return (
        <TouchableOpacity>
          <BackIcon/>
        </TouchableOpacity>
      );
  };

  return (
    <View style={styles.header}>

      <Text style={styles.title}>
        {title}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 40,
    color: colors.purple,
  }
});