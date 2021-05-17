import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import colors from '../design/tools.js';
import { Input, Button } from '../design/tools.js';

const url = 'http://192.168.1.115:5000'

export default function CreateUser() {

  const [username, setUsername] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [passphrase1, setPassphrase1] = React.useState("");
  const [passphrase2, setPassphrase2] = React.useState("");
  const [error, setError] = React.useState("");
  const [created, setCreated] = React.useState("");

  const handleEnter = async () => {
    const params = {username, passphrase1, passphrase2, email };
    console.log(JSON.stringify(params))
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    };
    const response = await fetch(url + '/create-user', requestOptions);
    const result = await response.json()
    .then(result => {
      if (result['status'] != null && result['status'] === "success") {
        setCreated(true);
      }else{
        setError(result['error']);
      }
    });
  }

  const newUsernameCheck = (username) => {
    if (username.length > 64)
      return "over 64 characters";
    if (username.length < 8)
      return "under 8 characters";
    return "";
  }

  const SYMBOLS = [' ', '!', '\"', '#', '$', '%', '&', '\'', '(', ')', '*', '+', ',', '-', '.', '/', ':', ';', '<', '=', '>', '?', '@', '[', '\\', ']', '^', '_', '`', '{', '|', '}', '~'];
  const NUMBERS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

  const newPassphraseCheck = (passphrase) => {
    if (passphrase == passphrase.toUpperCase())
      return "missing lowercase letter";
    if (passphrase == passphrase.toLowerCase())
      return "missing uppercase letter";

    var hasNumber = false;
    for (var i = 0; i < NUMBERS.length; i++)
      if (passphrase.indexOf(NUMBERS[i]) > -1)
        hasNumber = true;
    if (!hasNumber)
      return "missing number";

    var hasSymbol = false;
    for (var i = 0; i < SYMBOLS.length; i++)
      if (passphrase.indexOf(SYMBOLS[i]) > -1)
        hasSymbol = true;
    if (!hasSymbol)
      return "missing symbol";

    if (passphrase.length > 128)
      return "too long";
    if (passphrase.length < 8)
      return "too short";
    return "";
  }

  return (
    <View style={styles.page}>{
      error == "" ? (
        null
      ) : (
        <Text item style={styles.error}>
          {error}
        </Text>
      )
    }
      <Input label='Username' errorMethod={newUsernameCheck} setValueMethod={setUsername}/>
      <Input label='Email' setValueMethod={setEmail}/>
      <Input label='Passphrase 1' errorMethod={newPassphraseCheck} setValueMethod={setPassphrase1}/>
      <Input label='Passphrase 2' errorMethod={newPassphraseCheck} setValueMethod={setPassphrase2}/>
      <Button value={'Enter'} handleEnterMethod={handleEnter}/>
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
  error: {
    fontSize: 20,
    color: colors.red
  }
});