import React from 'react'

import { useNavigation } from '@react-navigation/native'

import ContentBox from '../../../Components/ContentBox'

interface MusicsOnPlaylistProps {
  musicsArray: Array<SpotifyApi.PlaylistTrackObject>,
}

const MusicsOnPlaylist:React.FC<MusicsOnPlaylistProps> = ({ musicsArray }) => {
  const { navigate } = useNavigation()

  return (
    <ContentBox
      title="Musics"

      contentStyle={{ marginTop: 0 }}

      buttonText={'Click here to see the songs'}
      buttonStyle={{ width: '100%' }}
      buttonOnPress={() => { navigate('FlatListMusics', { musicsArray: musicsArray }) }}
    />
  )
}

export default MusicsOnPlaylist
