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

const SpotifyCredentialsPage: React.FC = () => {
  const {credentialsStored, storeSpotifyClientId, storeSpotifyClientSecret} =
    useSpotifyDevCredentials();

  const [newSpotifyClientId, setNewSpotifyClientId] = useState(
    credentialsStored.spotifyClientId,
  );
  const [newSpotifyClientSecret, setNewSpotifyClientSecret] = useState(
    credentialsStored.spotifyClientSecret,
  );

  return (
    <View style={styles.container}>
      <View style={styles.infoTextContainer}>
        <View style={styles.infoTextTitleContainer}>
          <Text style={styles.infoTextTitle}>Spotify Credentials</Text>
          <MaterialCommunityIcons name="spotify" size={48} color="#4caf50" />
        </View>

        <Text style={styles.infoText}>
          How to get Spotify Developer Credentials:
          {'\n\n'}
          1. Access{' '}
          <Text
            style={styles.underlinedText}
            onPress={() =>
              Linking.openURL('https://developer.spotify.com/dashboard/login')
            }>
            Spotify For Developers
          </Text>
          .{'\n'}
          2. Login with any Spotify Account.
          {'\n'}
          3. Create An App.
          {'\n'}
          4. Add "com.darguima.spothack://oauthredirect" to "Redirect URIs" on
          settings.
          {'\n'}
          5. Add your account on "Users and Access".
          {'\n'}
          6. Copy the credentials.
          {'\n\n'}
          Or you can watch our{' '}
          <Text
            style={styles.underlinedText}
            onPress={() =>
              Linking.openURL(
                'https://github.com/Darguima/SpotHack/tree/main#spotify',
              )
            }>
            GitHub tutorial video
          </Text>
          .
        </Text>
      </View>

      <View style={styles.inputArea}>
        <View style={styles.inputContainer}>
          <Text style={styles.inputInfoText}>Client Id (required):</Text>
          <TextInput
            style={styles.input}
            value={newSpotifyClientId}
            onChangeText={text => setNewSpotifyClientId(text)}
            onEndEditing={({nativeEvent: {text}}) => {
              storeSpotifyClientId(text);
            }}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputInfoText}>Client Secret (required):</Text>
          <TextInput
            style={styles.input}
            value={newSpotifyClientSecret}
            onChangeText={text => setNewSpotifyClientSecret(text)}
            onEndEditing={({nativeEvent: {text}}) => {
              storeSpotifyClientSecret(text);
            }}
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
});

export default SpotifyCredentialsPage;
