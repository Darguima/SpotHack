import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';

import useSpotHackSettings from '../../../../../../contexts/spotHackSettings';
import ContentBox from '../../../../../Components/ContentBox';
import {SPOTHACK_SERVER_URL} from '@env';

const SpotHackServerUrlInput: React.FC = () => {
  const {spotHackSettings, saveNewSpotHackSettings} = useSpotHackSettings();

  const [newServerUrl, setNewServerUrl] = useState(
    spotHackSettings.spothackServerUrl,
  );
  const [isNewServerUrlValid, setIsNewServerUrlValid] = useState(true);

  const [serverUrlIsEditable, setServerUrlIsEditable] = useState(false);

  useEffect(() => {
    if (newServerUrl !== spotHackSettings.spothackServerUrl) {
      setNewServerUrl(newServerUrl);
    }
  }, [spotHackSettings]);

  const verifyAndSetNewUrlValid = (possibleNewUrl: string | undefined) => {
    const pattern =
      /^(https?:\/\/)?([a-zA-Z0-9.-]+(:[a-zA-Z0-9.-]+)?@)?([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})(:\d{2,5})?(\/[^\s]*)?$/;

    const valid =
      pattern.test(possibleNewUrl) ||
      possibleNewUrl === undefined ||
      possibleNewUrl === '';

    setIsNewServerUrlValid(valid);
    if (valid) {
      saveNewSpotHackSettings({spothackServerUrl: possibleNewUrl});
      setServerUrlIsEditable(false);
    }
  };

  return (
    <ContentBox title={'SpotHack Server'} style={styles.serverUrlContainer}>
      <Text style={styles.serverUrlDescription}>The SpotHack server URL: </Text>
      <TextInput
        style={[
          styles.serverUrlInput,
          isNewServerUrlValid ? {} : styles.invalidServerUrl,
        ]}
        value={newServerUrl}
        onChangeText={e => {
          setIsNewServerUrlValid(true);
          setNewServerUrl(e);
        }}
        editable={serverUrlIsEditable}
        multiline={false}
        autoCapitalize={'none'}
        placeholder={
          SPOTHACK_SERVER_URL !== undefined
            ? ' URL already defined internally'
            : ' SpotHack Server URL'
        }
        placeholderTextColor={'#888'}
      />

      <View style={styles.buttonsRowContainer}>
        {!serverUrlIsEditable ? (
          <View style={styles.serverUrlButtonContainer}>
            <TouchableOpacity
              style={styles.serverUrlButtons}
              activeOpacity={0.6}
              onPress={() => {
                setServerUrlIsEditable(!serverUrlIsEditable);
              }}>
              <Text style={styles.serverUrlButtonsText}>Edit</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <View style={styles.serverUrlButtonContainer}>
              <TouchableOpacity
                style={styles.serverUrlButtons}
                activeOpacity={0.6}
                onPress={() => {
                  setNewServerUrl(spotHackSettings.spothackServerUrl);
                  setIsNewServerUrlValid(true);
                  setServerUrlIsEditable(!serverUrlIsEditable);
                }}>
                <Text style={styles.serverUrlButtonsText}>Cancel</Text>
              </TouchableOpacity>
            </View>

            <View
              style={[
                styles.serverUrlButtonContainer,
                isNewServerUrlValid ? {} : styles.invalidServerUrl,
              ]}>
              <TouchableOpacity
                style={styles.serverUrlButtons}
                activeOpacity={0.6}
                onPress={() => {
                  verifyAndSetNewUrlValid(newServerUrl);
                }}>
                <Text
                  style={[
                    styles.serverUrlButtonsText,
                    isNewServerUrlValid
                      ? {}
                      : {...styles.invalidServerUrl, borderWidth: 0},
                  ]}>
                  Save
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </ContentBox>
  );
};

const styles = StyleSheet.create({
  serverUrlContainer: {},

  serverUrlDescription: {
    color: '#fff',

    marginBottom: '5%',
    fontSize: 15,
  },

  serverUrlInput: {
    color: '#fff',
    backgroundColor: '#212121',

    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 10,

    paddingVertical: '4%',
    fontSize: 16,
  },

  buttonsRowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  serverUrlButtonContainer: {
    width: '40%',
    marginTop: '10%',

    borderColor: '#1c5ed6',
    borderWidth: 1,
    borderRadius: 10,
  },

  serverUrlButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',

    width: '100%',

    marginVertical: '10%',
  },

  serverUrlButtonsText: {
    textAlign: 'center',
    color: '#1c5ed6',
    fontSize: 17,
    fontWeight: 'bold',
  },

  invalidServerUrl: {
    borderColor: '#f00',
    color: '#f00',
  },
});

export default SpotHackServerUrlInput;
