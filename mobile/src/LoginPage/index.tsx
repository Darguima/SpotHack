import React, { useState } from 'react'
import { Text, View, TextInput, StyleSheet } from 'react-native'
import { RectButton } from 'react-native-gesture-handler'

const LoginPage:React.FC = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const spotifyLogin = () => {}

  return (
    <View style={styles.container}>

      <View style={styles.titleTextContainer}>
        <Text style={styles.titleText}>LoginPage</Text>
      </View>

      <View style={styles.loginContainer}>
        <View style={styles.inputsContainers}>
          <TextInput
          style={[styles.inputs, styles.usernameInput]}

          placeholder={'username'}

          onChangeText={text => setUsername(text)}
          value={username}
          />
        </View>

        <View style={styles.inputsContainers}>
          <TextInput
            style={[styles.inputs, styles.passwordInput]}

          placeholder={'password'}

            onChangeText={text => setPassword(text)}
            value={password}
          />
        </View>

        <RectButton style={styles.loginButton} onPress={spotifyLogin}>
          <Text style={styles.loginButtonText}>Login</Text>
        </RectButton>

      </View>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center',

    backgroundColor: '#1c5ed6'
  },

  titleTextContainer: {
    width: '100%'
  },

  titleText: {
    textAlign: 'center',

    fontSize: 20
  },

  loginContainer: {
    justifyContent: 'space-around',
    alignItems: 'center',

    width: '80%',
    height: '50%',

    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 25

  },

  inputsContainers: {
    width: '70%',
    backgroundColor: '#fff',

    borderRadius: 25,

    padding: '4%'
  },

  inputs: {

  },

  usernameInput: {
  },
  passwordInput: {
  },

  loginButton: {
    width: '70%'
  },

  loginButtonText: {
    width: '100%',

    padding: '4%',

    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 25,

    textAlign: 'center',
    color: '#fff',
    fontSize: 18
  }
})

export default LoginPage
