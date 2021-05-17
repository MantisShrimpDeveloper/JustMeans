import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { TextInput } from 'react-native-paper';

const colors = {
  purple: '#512da8',
  grey: '#282c34',
  black: '#000000',
  dark_grey: '#1a1d22',
  light_grey: '#d0d0d0',
  white: '#FFFFFF',
  red: '#FF0000'
};

export default colors;

export function Input({label, setValueMethod, handleEnterMethod, errorMethod}) {

  const [focused, setFocused] = React.useState(false);
  const [error, setError] = React.useState("");

  const setValue = (text) => {
    setValueMethod(text);
    if (errorMethod)
      setError(errorMethod(text))
  }

  return (
    <TextInput label={label} mode='flat' error={error} left selectionColor={colors.purple} style={[styles.input, (focused ? styles.inputFocused : null)]} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} onChangeText={(text) => setValue(text)}/>
  );
}

export function Button({value, handleEnterMethod}) {

  return (
    <TouchableOpacity style={styles.button} onPress={handleEnterMethod}>
      <Text style={styles.buttonText}>
        {value}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  input: {
    fontSize: 20,
    width: '80%',
    margin: 5,
    backgroundColor: colors.light_grey,
  },
  inputFocused: {
    backgroundColor: colors.white,
  },
  button: {
    backgroundColor: colors.purple,
    borderRadius: 16,
    width: '80%',
    margin: 10,
  },
  buttonText: {
    fontSize: 28,
    textAlign: 'center',
    color: colors.white,
  }
});