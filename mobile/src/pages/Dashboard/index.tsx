import React from 'react'
import { Button, View, StyleSheet } from 'react-native'

import useAuth from '../../contexts/auth'

const Dashboard:React.FC = () => {
  const { logOut } = useAuth()
  return (
    <View style={styles.container}>
      <Button
        title="LogOut"
        onPress={logOut}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {

  }
})

export default Dashboard
