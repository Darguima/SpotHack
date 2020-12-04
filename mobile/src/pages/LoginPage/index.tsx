import React from 'react'
import { View, Button, StyleSheet } from 'react-native'
import useAuth from '../../contexts/auth'

const LoginPage:React.FC = () => {
  const { logIn } = useAuth()

  return (
    <View style={styles.container}>
      <Button
        onPress={() => { logIn() }}

        title="Login"
      >

      </Button>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {

  }
})

export default LoginPage
