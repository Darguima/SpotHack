import React, { useEffect, useState } from 'react'
import { Text, View, StyleSheet, TouchableOpacity, TextInput, ToastAndroid } from 'react-native'

import useSpotHackSettings from '../../../../../../contexts/spotHackSettings'
import { exists as existsPath, mkdir as createPath } from 'react-native-fs'

const RootPathInput:React.FC = () => {
  const { spotHackSettings, saveNewSpotHackSettings } = useSpotHackSettings()

  const [newRootPath, setNewRootPath] = useState(spotHackSettings.rootPath)
  const [isNewRootPathValid, setIsNewRootPathValid] = useState(true)

  const [rootPathIsEditable, setRootPathIsEditable] = useState(false)

  useEffect(() => {
    if (newRootPath !== spotHackSettings.rootPath) {
      setNewRootPath(newRootPath)
    }
  }, [spotHackSettings])

  const verifyAndSetNewRootPath = async (possibleNewRootPath: string) => {
    if (possibleNewRootPath.indexOf("\n") !== -1) {
      setIsNewRootPathValid(false)
      ToastAndroid.show('Path Invalid', ToastAndroid.LONG)
      return 
    }

    try {
      if (!await existsPath(possibleNewRootPath)) {
        createPath(possibleNewRootPath)
      }

      saveNewSpotHackSettings({rootPath: possibleNewRootPath })
      setRootPathIsEditable(false)
      ToastAndroid.show('Root Path Edited', ToastAndroid.LONG)
    } catch (err) {
      setIsNewRootPathValid(false)
      ToastAndroid.show('Path Invalid', ToastAndroid.LONG)
    }
  }

  return (
    <View style={styles.rootPathContainer}>
      <Text style={styles.rootPathTitle}>Root Path: </Text>
        <TextInput
          style={[styles.rootPathInput, isNewRootPathValid ? {} : styles.invalidRootPath]}

          value={newRootPath}
          onChangeText={e => {
            setIsNewRootPathValid(true)
            setNewRootPath(e)
          }}

          editable={rootPathIsEditable}

          multiline={true}
        />

        <View style={styles.buttonsRowContainer}>
          {!rootPathIsEditable
            ? <View style={styles.rootPathButtonContainer}>
                <TouchableOpacity
                  style={styles.rootPathButtons}
                  activeOpacity={0.6}
                  onPress={() => { setRootPathIsEditable(!rootPathIsEditable) }}
                >
                  <Text style={styles.rootPathButtonsText}>Edit</Text>
                </TouchableOpacity>
              </View>

            : <>
                <View style={styles.rootPathButtonContainer}>
                  <TouchableOpacity
                    style={styles.rootPathButtons}
                    activeOpacity={0.6}
                    onPress={() => {
                      setNewRootPath(spotHackSettings.rootPath)
                      setIsNewRootPathValid(true)
                      setRootPathIsEditable(!rootPathIsEditable)
                    }}
                  >
                    <Text style={styles.rootPathButtonsText}>Cancel</Text>
                  </TouchableOpacity>
                </View>

                <View style={[styles.rootPathButtonContainer, isNewRootPathValid ? {} : styles.invalidRootPath]}>
                  <TouchableOpacity
                    style={styles.rootPathButtons}
                    activeOpacity={0.6}
                    onPress={() => { verifyAndSetNewRootPath(newRootPath) }}
                  >
                    <Text
                      style={[styles.rootPathButtonsText, isNewRootPathValid ? {} : { ...styles.invalidRootPath, borderWidth: 0 }]}
                    >
                      Save
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
          }
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  rootPathContainer: {},

  rootPathTitle: {
    color: '#fff',

    marginHorizontal: '10%',
    fontSize: 18,
    fontWeight: 'bold'
  },

  rootPathInput: {
    color: '#fff',
    backgroundColor: '#212121',

    marginHorizontal: '10%',
    paddingLeft: '5%',
    fontSize: 16
  },

  buttonsRowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },

  rootPathButtonContainer: {
    width: '40%',
    marginTop: '10%',

    borderColor: '#1c5ed6',
    borderWidth: 1,
    borderRadius: 10
  },

  rootPathButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',

    width: '100%',

    marginVertical: '10%'

  },

  rootPathButtonsText: {
    textAlign: 'center',
    color: '#1c5ed6',
    fontSize: 17,
    fontWeight: 'bold'
  },

  invalidRootPath: {
    borderWidth: 1,
    borderColor: '#f00',
    color: '#f00'
  }
})

export default RootPathInput
