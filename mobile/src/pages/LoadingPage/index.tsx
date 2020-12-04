import React from 'react'
import { Text, View, StyleSheet } from 'react-native'

const LoadingPage:React.FC = ({}) => {
  return (
    <View style={styles.container}>
      <Text>Loading</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {

  }
})

export default LoadingPage
