import React, { useEffect, useState } from 'react'
import { Text, View, Image, StyleSheet, ImageSourcePropType } from 'react-native'
import spotifyApi, { spotifyApiArtistsResponseItems } from '../../../../services/spotifyApi'
import convertArrayToString from '../../../../utils/convertArrayToString'

import ContentBox from '../../../Components/ContentBox'

interface ArtistsDataProps {
  artistsArray: Array<{ name: string; spotifyId: string; }>
}

interface ArtistsDataSchema {
  spotifyId: string,
  image: ImageSourcePropType,
  name: string,
  followers: number
  genres: string,
  popularity: number,
}

const ArtistsData:React.FC<ArtistsDataProps> = ({ artistsArray }) => {
  const [newArtistsArray, setNewArtistsArray] = useState<Array<ArtistsDataSchema>>([{
    spotifyId: '',
    image: require('../../../../assets/graySquare.jpg'),
    name: 'Artist',
    followers: 0,
    genres: 'Music',
    popularity: 0
  }])

  useEffect(() => {
    try {
      const getArtistsData = Promise.all(artistsArray.map(async (item) => {
        if (item.spotifyId) {
          const spotifyUserData: spotifyApiArtistsResponseItems = (await spotifyApi.get(`artists/${item.spotifyId}`)).data

          return {
            name: spotifyUserData.name,
            popularity: spotifyUserData.popularity,
            spotifyId: spotifyUserData.id,

            image: spotifyUserData.images.length > 0
              ? { uri: (spotifyUserData.images[1] || spotifyUserData.images[0]).url }
              : require('../../../../assets/graySquare.jpg'),

            genres: convertArrayToString(spotifyUserData.genres.length > 0
              ? spotifyUserData.genres
              : ['Music'], ' & '),
            followers: spotifyUserData.followers.total
          }
        } else {
          return {
            spotifyId: '',
            image: require('../../../../assets/graySquare.jpg'),
            name: 'Artist',
            followers: 0,
            genres: 'Music',
            popularity: 0
          }
        }
      }))

      getArtistsData.then(artistsData => {
        setNewArtistsArray(artistsData)
      })
    } catch (err) {
    }
  }, [artistsArray])

  return (
    <ContentBox title="Artists Info">

      {newArtistsArray.map((item, index) => (
        <View key={index} style={[
          styles.InfoContainer,
          index === 0 ? { borderTopWidth: 0, paddingTop: 0 } : {},
          index === artistsArray.length ? { paddingBottom: 0 } : {}
        ]}>

          <Image source={item.image} style={styles.artistImage}/>

          <View style={styles.textData}>
            <Text style={styles.artistName}>{item.name}</Text>

            <Text style={styles.dataContainer}>
              <Text style={styles.dataTitle}>Genre</Text>
              <Text style={styles.dataText}> - {item.genres}</Text>
            </Text>

            <Text style={styles.dataContainer}>
              <Text style={styles.dataTitle}>Followers</Text>
              <Text style={styles.dataText}> - {item.followers}</Text>
            </Text>

            <Text style={styles.dataContainer}>
              <Text style={styles.dataTitle}>Spotify Popularity</Text>
              <Text style={styles.dataText}> - {item.popularity}</Text>
            </Text>
          </View>

        </View>
      ))}

    </ContentBox>
  )
}

const styles = StyleSheet.create({
  InfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',

    borderTopColor: '#aaa',
    borderTopWidth: 1,

    paddingVertical: '6%'
  },

  artistImage: {
    width: '30%',
    aspectRatio: 1,

    marginRight: '3%'
  },

  textData: {
    width: '65%'
  },

  artistName: {
    color: '#1c5ed6',

    marginBottom: '5%',

    fontWeight: 'bold',
    fontSize: 16
  },

  dataContainer: {
    flexDirection: 'row'
  },

  dataTitle: {
    color: '#fff',

    fontWeight: 'bold',
    fontSize: 15
  },

  dataText: {
    color: '#fff'
  }

})

export default ArtistsData
