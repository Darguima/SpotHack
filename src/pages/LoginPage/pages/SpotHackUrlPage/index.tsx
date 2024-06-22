import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  TextInput,
  StyleSheet,
  Dimensions,
  Linking,
  Image,
} from 'react-native';

import useSpotHackSettings from '../../../../contexts/spotHackSettings';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import validateURL from '../../../../utils/validateURL';

const SpotHackUrlPage: React.FC = () => {
  const {spotHackSettings, saveNewSpotHackSettings} = useSpotHackSettings();

  const [newServerUrl, setNewServerUrl] = useState('');
  const [isNewServerUrlValid, setIsNewServerUrlValid] = useState(true);

  useEffect(() => {
    setNewServerUrl(spotHackSettings.spothackServerUrl);
  }, [spotHackSettings]);

  const verifyAndSetNewUrlValid = (possibleNewUrl: string | undefined) => {
    const valid =
      possibleNewUrl === undefined ||
      validateURL(possibleNewUrl) ||
      possibleNewUrl === '';

    setIsNewServerUrlValid(valid);
    if (valid) {
      saveNewSpotHackSettings({spothackServerUrl: possibleNewUrl});
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.infoTextContainer}>
        <View style={styles.infoTextTitleContainer}>
          <Text style={styles.infoTextTitle}>SpotHack Server URL</Text>
          <Image
            source={require('../../../../assets/icons/homeIconWhite.png')}
            style={{width: 48, height: 48}}
            height={48}
            width={48}
          />
        </View>

        <Text style={styles.infoText}>
          How to deploy SpotHack Server:
          {'\n\n'}
          1. Get a Linux server/computer.
          {'\n'}
          2. Clone the repo `git clone git@github.com:Darguima/SpotHack.git
          SpotHackServer`
          {'\n'}
          3. Enter the folder `cd SpotHackServer`
          {'\n'}
          4. Go to the server branch `git switch server`
          {'\n'}
          5. Install the dependencies `yarn`
          {'\n'}
          6. Start the server `yarn build; yarn deploy`
          {'\n'}
          {
            '7. The URL that you use to access the server is the URL that you need to put here (`localhost` is not valid - probably is `https://<server_IP>:3000`).'
          }
          {'\n\n'}
          Or you can read our{' '}
          <Text
            style={styles.underlinedText}
            onPress={() =>
              Linking.openURL(
                'https://github.com/Darguima/SpotHack/tree/main#spothack-server-',
              )
            }>
            GitHub tutorial
          </Text>
          .
        </Text>
      </View>

      <View style={styles.inputArea}>
        <View style={styles.inputContainer}>
          <Text style={styles.inputInfoText}>URL:</Text>
          <TextInput
            style={[
              styles.input,
              isNewServerUrlValid ? {} : styles.invalidServerUrl,
            ]}
            value={newServerUrl}
            onChangeText={text => setNewServerUrl(text)}
            onEndEditing={({nativeEvent: {text}}) => {
              verifyAndSetNewUrlValid(text);
            }}
            multiline={false}
            autoCapitalize={'none'}
          />
        </View>
      </View>

      <View style={styles.swipeSideContainer}>
        <MaterialCommunityIcons
          name="gesture-swipe-left"
          size={24}
          color="#000"
        />
        <Text style={styles.swipeSideText}>
          Swipe Left - Youtube Credentials
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },

  infoTextContainer: {
    width: '100%',
    height: '40%',

    justifyContent: 'space-between',
    alignItems: 'center',
  },

  infoTextTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',

    marginTop: 16,
  },

  infoTextTitle: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: 'bold',

    marginRight: 8,
  },

  infoText: {
    width: '90%',
    fontSize: 16,
  },

  underlinedText: {
    color: '#000',
    textDecorationLine: 'underline',
  },

  inputArea: {
    justifyContent: 'space-evenly',
    alignItems: 'center',

    width: '100%',
    flex: 1,
  },

  inputContainer: {
    width: '80%',
  },

  inputInfoText: {
    fontSize: 16,
    marginBottom: 8,
  },

  input: {
    backgroundColor: '#fff',

    borderRadius: 8,
    borderWidth: 2,
  },

  swipeSideContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',

    paddingBottom: 32,
  },

  swipeSideText: {
    fontSize: 14,
  },

  invalidServerUrl: {
    borderColor: '#f00',
    color: '#f00',
  },
});

export default SpotHackUrlPage;
