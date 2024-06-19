import React, {useCallback, useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {
  Text,
  View,
  StyleSheet,
  BackHandler,
  FlatList,
  ActivityIndicator,
} from 'react-native';

import SearchBarHeader from '../../Components/SearchBarHeader';
import MusicPlaylistView from '../../Components/MusicPlaylistView';

import getMusicDataFromSpotify from './getMusicDataFromSpotify';

import useUserHistory, {
  musicsSpotifyResponseSchema,
} from '../../../contexts/userHistory';
import useAppUtils from '../../../contexts/appUtils';
import {StackScreenProps} from '@react-navigation/stack';

const SearchMusicPage: React.FC<StackScreenProps<any>> = ({navigation}) => {
  const [searchedMusic, setSearchedMusic] = useState('');
  const {changeMusicSearchInputValue, setChangeMusicSearchInputValue} =
    useAppUtils();

  const [errorMessage, setErrorMessage] = useState<Array<string>>([]);
  const [musicsSpotifyResponse, setMusicsSpotifyResponse] = useState<
    Array<musicsSpotifyResponseSchema>
  >([]);
  const [offset, setOffset] = useState(-1);
  const offsetIncrease = 20;

  const {
    musicSearchHistory,
    addMusicToMusicSearchHistory,
    removeMusicFromMusicSearchHistory,
  } = useUserHistory();

  const {navigate} = useNavigation();

  // Search musics and save on the state
  useEffect(() => {
    setMusicsSpotifyResponse([]);

    if (searchedMusic) {
      setErrorMessage(['Searching']);
      if (offset !== 0) {
        setOffset(0);
      } else {
        refreshMusicsData(true);
      }
    } else {
      setErrorMessage([]);
      setOffset(-1);
    }
  }, [searchedMusic]);

  const refreshMusicsData = useCallback(
    async (clearMusicsSpotifyResponse = false) => {
      if (offset === -1) {
        return;
      }

      const response = await getMusicDataFromSpotify(
        searchedMusic,
        offset,
        offsetIncrease,
      );

      if (response.err.length === 0) {
        setMusicsSpotifyResponse([
          ...(!clearMusicsSpotifyResponse ? musicsSpotifyResponse : []),
          ...response.response,
        ]);
        setErrorMessage([]);
      } else {
        setMusicsSpotifyResponse([]);
        setErrorMessage(response.err);
      }
    },
    [searchedMusic, offset, musicsSpotifyResponse],
  );

  useEffect(() => {
    refreshMusicsData();
  }, [offset]);

  // BackButton handler
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
      if (searchedMusic === '') {
        return false;
      } else {
        changeMusicSearchInputValue('');
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
  }, [changeMusicSearchInputValue, searchedMusic]);

  const renderMusicBox = ({
    item,
    index,
  }: {
    item: musicsSpotifyResponseSchema;
    index: number;
  }) => (
    <MusicPlaylistView
      key={index}
      style={{
        marginTop: index === 0 ? '4%' : '2%',
        marginBottom: index === musicsSpotifyResponse.length - 1 ? '4%' : '2%',
      }}
      imageSource={item.image}
      title={item.title}
      artists={item.artists}
      viewPressAction={() => {
        navigate('MusicDetailPage', {
          spotifyId: item.spotifyId,
          image: item.image,
          title: item.title,
          artists: item.artists,
        });
        addMusicToMusicSearchHistory(item);
      }}
      entypoIconName={searchedMusic !== '' ? 'chevron-right' : 'cross'}
      iconPressAction={() => {
        if (searchedMusic !== '') {
          navigate('MusicDetailPage', {
            spotifyId: item.spotifyId,
            image: item.image,
            title: item.title,
            artists: item.artists,
          });
          addMusicToMusicSearchHistory(item);
        } else {
          removeMusicFromMusicSearchHistory(item.spotifyId);
        }
      }}
    />
  );

  return (
    <View style={styles.container}>
      <SearchBarHeader
        setState={setSearchedMusic}
        setChangeInputValue={setChangeMusicSearchInputValue}
        inputPlaceholder="Search a music"
        viewBackgroundColor="#1c5ed6"
      />

      {searchedMusic !== '' && (
        <FlatList
          data={musicsSpotifyResponse}
          renderItem={renderMusicBox}
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

      {searchedMusic === '' && (
        <FlatList
          data={musicSearchHistory}
          renderItem={renderMusicBox}
          keyExtractor={item => item.spotifyId}
          ListEmptyComponent={
            <>
              <Text style={styles.noTrackFoundText}>Search Something</Text>
            </>
          }
        />
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

export default SearchMusicPage;
