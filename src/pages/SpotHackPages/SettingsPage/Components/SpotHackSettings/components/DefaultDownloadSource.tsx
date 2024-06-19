import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Picker} from '@react-native-community/picker';
import ContentBox from '../../../../../Components/ContentBox';
import useSpotHackSettings from '../../../../../../contexts/spotHackSettings';

const DefaultDownloadSource: React.FC = () => {
  const {spotHackSettings, saveNewSpotHackSettings} = useSpotHackSettings();

  return (
    <ContentBox
      title={'Default Download Source'}
      style={styles.defaultDownloadOptionContainer}>
      <Text style={styles.defaultDownloadOptionDescription}>
        The default source of your songs:
      </Text>

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={spotHackSettings.defaultDownloadSource}
          style={styles.picker}
          onValueChange={itemValue =>
            saveNewSpotHackSettings({
              defaultDownloadSource: itemValue as string,
            })
          }>
          <Picker.Item
            label="Youtube - First Video on Search"
            value="ytFirstVideoOnSearch"
          />
          <Picker.Item label="Youtube - Lyrics Video" value="ytLyricsVideo" />
        </Picker>
      </View>
    </ContentBox>
  );
};

const styles = StyleSheet.create({
  defaultDownloadOptionContainer: {},

  defaultDownloadOptionDescription: {
    color: '#fff',

    marginBottom: '5%',
    fontSize: 15,
  },

  pickerContainer: {
    width: '100%',

    backgroundColor: '#212121',

    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 10,
  },

  picker: {
    color: '#fff',
    borderRadius: 10,
  },
});

export default DefaultDownloadSource;
