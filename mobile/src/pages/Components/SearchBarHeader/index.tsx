import React from 'react'
import { TextInput, View, StyleSheet } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons'

interface SearchBarHeaderProps {
  state: string,
  setState: React.Dispatch<React.SetStateAction<string>>,

  backgroundColor?: string,
  inputBackgroundColor?: string,
}

const SearchBarHeader:React.FC<SearchBarHeaderProps> = ({ state, setState, backgroundColor = '#000', inputBackgroundColor = '#fff' }) => {
  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={[styles.inputContainer, { backgroundColor: inputBackgroundColor }]}>
        <View style={styles.textInputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Search a music"
            value={state}
            onChangeText={(e) => { setState(e) }}
          />
        </View>
        <View style={styles.magnifyIconContainer}>
          <MaterialCommunityIcons
            name="magnify"
            style={styles.magnifyIcon}
            size={25}
          />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',

    width: '100%',
    height: '9%'
  },

  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',

    width: '80%',
    height: '70%',

    borderRadius: 25
  },

  textInputContainer: {
    justifyContent: 'center',
    alignItems: 'flex-start',

    width: '70%',
    height: '90%'
  },

  textInput: {
  },

  magnifyIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',

    width: '10%',
    height: '90%'
  },

  magnifyIcon: {
  }
})

export default SearchBarHeader
