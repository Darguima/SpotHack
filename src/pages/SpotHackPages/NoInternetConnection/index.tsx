import React from 'react';
import {Text, View, StyleSheet} from 'react-native';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const NoInternetConnection: React.FC = () => {
  return (
    <View style={styles.container}>
      <MaterialIcons name="wifi-off" size={128} color="black" />
      <Text style={styles.noConnectionText}>No Connection</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'space-evenly',
    backgroundColor: '#1c5ed6',
    height: '100%',
    width: '100%',
  },

  noConnectionText: {
    fontSize: 32,
    fontWeight: 'bold',
  },
});

export default NoInternetConnection;
