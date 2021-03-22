import React from 'react'
import { StyleSheet, View } from 'react-native'

import ContentBox from '../../../../Components/ContentBox'
import RootPathInput from './components/RootPathInput'

const SpotifyAccountSettings:React.FC = () => {
  return (
    <ContentBox
      title="SpotHack Settings"
    >
      <View style={styles.content}>

        <View style={styles.rootPathContainer}>
          <RootPathInput />
        </View>

      </View>
    </ContentBox>
  )
}

const styles = StyleSheet.create({
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },

  rootPathContainer: {
    width: '100%'
  }

})

export default SpotifyAccountSettings
