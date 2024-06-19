import React from 'react';
import {
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import ContentBox from '../../../Components/ContentBox';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import downloadMachine, {
  musicForQueueSchema,
} from '../../../../SpotHack_Core/DownloadMachine';
import createYoutubeQuery from '../../../../utils/createYoutubeQuery';
import convertArtistsArrayToString from '../../../../utils/convertArtistsArrayToString';
import useSpotHackSettings from '../../../../contexts/spotHackSettings';
import Clipboard from '@react-native-community/clipboard';

interface PlaylistOptionsProps {
  musicsArray: Array<SpotifyApi.PlaylistTrackObject>;
  playlistName: string;
  playlistId: string;
}

const PlaylistOptions: React.FC<PlaylistOptionsProps> = ({
  musicsArray,
  playlistName,
  playlistId,
}) => {
  const {spotHackSettings} = useSpotHackSettings();
  const {navigate} = useNavigation();

  return (
    <ContentBox title="Playlist Options" contentStyle={styles.contentBox}>
      <View style={styles.twoButtonsContainer}>
        <View style={[styles.buttonContainer, styles.shortButtonContainer]}>
          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.6}
            onPress={() => {
              navigate('FlatListMusics', {musicsArray: musicsArray});
            }}>
            <Text style={styles.buttonText}>Songs</Text>
            <MaterialCommunityIcons
              name="playlist-music"
              style={styles.icon}
              size={17}
            />
          </TouchableOpacity>
        </View>

        <View style={[styles.buttonContainer, styles.shortButtonContainer]}>
          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.6}
            onPress={() => {
              Clipboard.setString(playlistId);
              ToastAndroid.show('Copied Playlist Id ', ToastAndroid.LONG);
            }}>
            <Text style={styles.buttonText}>Playlist Id</Text>
            <MaterialCommunityIcons
              name="clipboard"
              style={styles.icon}
              size={17}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={[styles.buttonContainer, styles.bigButtonContainer]}>
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.6}
          onPress={async () => {
            const playlistInfo: Array<musicForQueueSchema> = musicsArray.map(
              item => {
                return {
                  spotifyId: item.track.id,
                  youtubeId: '',

                  musicName: item.track.name,
                  artists: convertArtistsArrayToString(item.track.artists),
                  thumbnail:
                    item.track.album.images.length > 0
                      ? item.track.album.images[0].url
                      : '',
                  albumName: item.track.album.name,

                  playlistName: playlistName,
                  playlistId: playlistId,
                  youtubeQuery: createYoutubeQuery(
                    convertArtistsArrayToString(item.track.artists),
                    item.track.name,
                  ),

                  downloadSource: spotHackSettings.defaultDownloadSource,
                };
              },
            );

            const downloadStatus =
              await downloadMachine.addMusicsToDownloadQueue(playlistInfo);

            downloadStatus.successCode
              ? ToastAndroid.show('Downloading Playlist', ToastAndroid.LONG)
              : ToastAndroid.show(downloadStatus.msg, ToastAndroid.LONG);
          }}>
          <Text style={styles.buttonText}>Download</Text>
          <MaterialCommunityIcons
            name="download"
            style={styles.icon}
            size={17}
          />
        </TouchableOpacity>
      </View>
    </ContentBox>
  );
};

const styles = StyleSheet.create({
  contentBox: {
    marginTop: 0,
    flexDirection: 'column',
  },

  twoButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  bigButtonContainer: {
    width: '100%',
  },

  shortButtonContainer: {
    width: '45%',
  },

  buttonContainer: {
    height: 64,
    marginTop: '10%',

    borderColor: '#1c5ed6',
    borderWidth: 1,
    borderRadius: 10,
  },

  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',

    width: '100%',
    height: '100%',
  },

  buttonText: {
    textAlign: 'center',
    color: '#1c5ed6',
    fontSize: 17,
    fontWeight: 'bold',
  },

  icon: {
    color: '#1c5ed6',
    marginLeft: '5%',
  },
});

export default PlaylistOptions;
