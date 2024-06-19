import React from 'react';
import {Text, StyleSheet, Image, View} from 'react-native';

import ContentBox from '../../../../Components/ContentBox';

import useAuth from '../../../../../contexts/auth';
import useUserData from '../../../../../contexts/userData';

const SpotifyAccountSettings: React.FC = () => {
  const {logOut} = useAuth();
  const {userData} = useUserData();

  return (
    <ContentBox
      title="Spotify Settings"
      buttonText="Log Out"
      buttonOnPress={logOut}>
      <View style={styles.content}>
        <Image source={userData.image} style={styles.userDataImage} />

        <Text style={styles.userDataUsername}>{userData.display_name}</Text>
      </View>
    </ContentBox>
  );
};

const styles = StyleSheet.create({
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },

  userDataImage: {
    height: 50,
    width: 50,
    borderRadius: 50,
  },

  userDataUsername: {
    color: '#fff',

    marginHorizontal: '10%',
    fontSize: 18,
  },
});

export default SpotifyAccountSettings;
