import React, {useState} from 'react';
import {
  Text,
  View,
  TextInput,
  StyleSheet,
  Dimensions,
  Linking,
} from 'react-native';
import useSpotifyDevCredentials from '../../../../contexts/apiCredentials';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const YoutubeCredentialsPage: React.FC = () => {
  const {credentialsStored, storeYoutubeApiKey} = useSpotifyDevCredentials();

  const [newYoutubeApiKey, setNewYoutubeApiKey] = useState(
    credentialsStored.youtubeApiKey,
  );

  return (
    <View style={styles.container}>
      <View style={styles.infoTextContainer}>
        <View style={styles.infoTextTitleContainer}>
          <Text style={styles.infoTextTitle}>Youtube Credentials</Text>
          <MaterialCommunityIcons name="youtube" size={48} color="#f00" />
        </View>

        <Text style={styles.infoText}>
          How to get Youtube API Credentials:
          {'\n\n'}
          1. Access{' '}
          <Text
            style={styles.underlinedText}
            onPress={() =>
              Linking.openURL(
                'https://console.cloud.google.com/getting-started',
              )
            }>
            Google Cloud Platform
          </Text>
          .{'\n'}
          2. Login with any Google Account.
          {'\n'}
          3. Select and create a new project.
          {'\n'}
          4. Add the{' '}
          <Text style={styles.underlinedText}>YouTube Data API v3</Text> to your
          project from APIs Library.
          {'\n'}
          6. Fill in the "OAuth consent Screen".
          {'\n'}
          5. Create and copy the credentials.
          {'\n\n'}
          Or you can watch our{' '}
          <Text
            style={styles.underlinedText}
            onPress={() =>
              Linking.openURL(
                'https://github.com/Darguima/SpotHack/tree/main#youtube',
              )
            }>
            GitHub tutorial video
          </Text>
          .
        </Text>
      </View>
      <View style={styles.inputArea}>
        <View style={styles.inputContainer}>
          <Text style={styles.inputInfoText}>API Key (optional):</Text>
          <TextInput
            style={styles.input}
            value={newYoutubeApiKey}
            onChangeText={text => setNewYoutubeApiKey(text)}
            onEndEditing={({nativeEvent: {text}}) => {
              storeYoutubeApiKey(text);
            }}
          />
        </View>
      </View>

      <View style={styles.swipeSideContainer}>
        <MaterialCommunityIcons
          name="gesture-swipe-right"
          size={24}
          color="#000"
        />
        <Text style={styles.swipeSideText}>
          Swipe Right - Spotify Credentials
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
});

export default YoutubeCredentialsPage;
