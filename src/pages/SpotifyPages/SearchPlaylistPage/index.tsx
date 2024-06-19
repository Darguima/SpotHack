import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  BackHandler,
  ScrollView,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import SearchBarHeader from '../../Components/SearchBarHeader';
import NoSearchContent from './Components/NoSearchContent';

import MusicPlaylistView from '../../Components/MusicPlaylistView';

import useAppUtils from '../../../contexts/appUtils';
import useUserHistory, {
  playlistsSpotifyResponseSchema,
} from '../../../contexts/userHistory';

import getPlaylistDataFromSpotify from './getPlaylistDataFromSpotify';

import {StackScreenProps} from '@react-navigation/stack';

const SearchPlaylistPage: React.FC<StackScreenProps<any>> = ({navigation}) => {
  const [searchedPlaylist, setSearchedPlaylist] = useState('');
  const {changePlaylistSearchInputValue, setChangePlaylistSearchInputValue} =
    useAppUtils();

  const [errorMessage, setErrorMessage] = useState<Array<string>>([]);
  const [playlistsSpotifyResponse, setPlaylistsSpotifyResponse] = useState<
    Array<playlistsSpotifyResponseSchema>
  >([]);
  const [offset, setOffset] = useState(-1);
  const offsetIncrease = 20;

  const {
    addPlaylistToPlaylistSearchHistory,
    removePlaylistFromPlaylistSearchHistory,
  } = useUserHistory();

  const {navigate} = useNavigation();

  // Search playlists and save on the state

  useEffect(() => {
    setPlaylistsSpotifyResponse([]);

    if (searchedPlaylist) {
      setErrorMessage(['Searching']);
      if (offset !== 0) {
        setOffset(0);
      } else {
        refreshPlaylistsData(true);
      }
    } else {
      setErrorMessage([]);
      setOffset(-1);
    }
  }, [searchedPlaylist]);

  const refreshPlaylistsData = useCallback(
    async (clearPlaylistsSpotifyResponse = false) => {
      if (offset === -1) {
        return;
      }

      const response = await getPlaylistDataFromSpotify(
        searchedPlaylist,
        offset,
        offsetIncrease,
      );

      if (response.err.length === 0) {
        setPlaylistsSpotifyResponse([
          ...(!clearPlaylistsSpotifyResponse ? playlistsSpotifyResponse : []),
          ...response.response,
        ]);
        setErrorMessage([]);
      } else {
        setPlaylistsSpotifyResponse([]);
        setErrorMessage(response.err);
      }
    },
    [searchedPlaylist, offset, playlistsSpotifyResponse],
  );

  useEffect(() => {
    refreshPlaylistsData();
  }, [offset]);

  // BackButton Handler
  useEffect(() => {
    const addListenerBackPress = () => {
      BackHandler.addEventListener('hardwareBackPress', handleBackButtonPress);
    };

    const removeListenerBackPress = () => {
      BackHandler.removeEventListener(
        'hardwareBackPress',
        handleBackButtonPress,
      );
    };

    const handleBackButtonPress = () => {
      if (searchedPlaylist === '') {
        return false;
      } else {
        changePlaylistSearchInputValue('');
        return true;
      }
    };

    if (navigation.isFocused()) {
      addListenerBackPress();
      navigation.addListener('focus', addListenerBackPress);
    } else {
      navigation.addListener('focus', addListenerBackPress);
    }

    navigation.addListener('blur', removeListenerBackPress);

    return () => {
      navigation.removeListener('focus', addListenerBackPress);
      navigation.removeListener('blur', removeListenerBackPress);

      BackHandler.removeEventListener(
        'hardwareBackPress',
        handleBackButtonPress,
      );
    };
  }, [changePlaylistSearchInputValue, searchedPlaylist]);

  const renderPlaylistBox = ({
    item,
    index,
  }: {
    item: playlistsSpotifyResponseSchema;
    index: number;
  }) => (
    <MusicPlaylistView
      key={index}
      style={{
        marginTop: index === 0 ? '4%' : '2%',
        marginBottom:
          index === playlistsSpotifyResponse.length - 1 ? '4%' : '2%',
      }}
      imageSource={item.image}
      title={item.name}
      artists={item.owner}
      viewPressAction={() => {
        navigate('PlaylistDetailPage', {
          spotifyId: item.spotifyId,
          image: item.image,
          title: item.name,
          artists: item.owner,
        });
        addPlaylistToPlaylistSearchHistory(item);
      }}
      entypoIconName={searchedPlaylist !== '' ? 'chevron-right' : 'cross'}
      iconPressAction={() => {
        if (searchedPlaylist !== '') {
          navigate('PlaylistDetailPage', {
            spotifyId: item.spotifyId,
            image: item.image,
            title: item.name,
            artists: item.owner,
          });
          addPlaylistToPlaylistSearchHistory(item);
        } else {
          removePlaylistFromPlaylistSearchHistory(item.spotifyId);
        }
      }}
    />
  );

  return (
    <View style={styles.container}>
      <SearchBarHeader
        setState={setSearchedPlaylist}
        setChangeInputValue={setChangePlaylistSearchInputValue}
        inputPlaceholder="Search a playlist"
        viewBackgroundColor="#1c5ed6"
      />

      {searchedPlaylist !== '' && (
        <FlatList
          data={playlistsSpotifyResponse}
          renderItem={renderPlaylistBox}
          keyExtractor={(item, index) => `${item.spotifyId}_${index}`}
          onEndReached={() => {
            if (offset + offsetIncrease <= 1000) {
              setOffset(offset + offsetIncrease);
            }
          }}
          onEndReachedThreshold={0.5}
          initialNumToRender={5}
          ListFooterComponent={
            <ActivityIndicator
              color={'#1c5ed6'}
              size={
                (offset + offsetIncrease <= 1000 &&
                  errorMessage.length === 0) ||
                (errorMessage.length === 1 && errorMessage[0] === 'Searching')
                  ? 25
                  : 0
              }
            />
          }
          ListFooterComponentStyle={
            offset + offsetIncrease <= 1000 ? styles.flatListFooter : {}
          }
          ListEmptyComponent={
            <>
              {errorMessage.map((item, index) => (
                <Text key={index} style={styles.noTrackFoundText}>
                  {item}
                </Text>
              ))}
            </>
          }
        />
      )}

      {searchedPlaylist === '' && (
        <ScrollView>
          <NoSearchContent />
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: '#000',
  },

  noTrackFoundText: {
    width: '100%',
    textAlign: 'center',

    marginVertical: 20,

    fontSize: 18,
    color: '#fff',
  },
  flatListFooter: {
    marginBottom: '4%',
  },
});

export default SearchPlaylistPage;
