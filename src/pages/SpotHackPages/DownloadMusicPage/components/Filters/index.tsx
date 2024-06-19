import React, {useState} from 'react';
import {Text, View, StyleSheet, TouchableOpacity, Switch} from 'react-native';
import {Picker} from '@react-native-picker/picker';

import useSpotHackSettings from '../../../../../contexts/spotHackSettings';
import {playlistsOnQueueSchema} from '../../../../../SpotHack_Core/DownloadMachine';

interface FiltersProps {
  playlistsOnQueue: playlistsOnQueueSchema;
  playlistIdToFilter: string;
  setPlaylistIdToFilter: React.Dispatch<React.SetStateAction<string>>;
}

const Filters: React.FC<FiltersProps> = ({
  playlistsOnQueue,
  playlistIdToFilter,
  setPlaylistIdToFilter,
}) => {
  const [showFilters, setShowFilters] = useState(false);

  const {
    saveNewSpotHackSettings,
    spotHackSettings: {
      downloadsPage: {showAlreadyDownloadedMusics},
    },
  } = useSpotHackSettings();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.clickToShowFiltersContainer}
        onPress={() => setShowFilters(!showFilters)}>
        <Text style={styles.clickToShowFiltersText}>
          Click to {showFilters ? 'Hide' : 'Show'}
          <Text style={{fontWeight: 'bold', color: '#fff'}}> Filters</Text>
        </Text>
      </TouchableOpacity>

      {showFilters && (
        <View style={styles.filtersContainer}>
          <View style={styles.filterOption}>
            <Text style={styles.filterOptionText}>Filter Playlist: </Text>

            <View style={styles.playlistPickerContainer}>
              <Picker
                style={styles.playlistPicker}
                selectedValue={playlistIdToFilter}
                onValueChange={itemValue =>
                  setPlaylistIdToFilter(itemValue as string)
                }>
                <Picker.Item label="All Playlists" value="all" />
                {playlistsOnQueue.map(playlistOnQueue => (
                  <Picker.Item
                    key={playlistOnQueue.playlistId}
                    label={playlistOnQueue.playlistName}
                    value={playlistOnQueue.playlistId}
                  />
                ))}
              </Picker>
            </View>
          </View>

          <View style={styles.filterOption}>
            <Text style={styles.filterOptionText}>
              Show Already Downloaded Musics:{' '}
            </Text>
            <Switch
              onValueChange={value => {
                saveNewSpotHackSettings({
                  downloadsPage: {
                    showAlreadyDownloadedMusics: value,
                  },
                });
              }}
              value={showAlreadyDownloadedMusics}
            />
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#212121',

    marginVertical: '3%',
  },

  clickToShowFiltersContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',

    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#444',

    paddingVertical: '3%',
  },

  clickToShowFiltersText: {
    color: '#aaa',
  },

  filtersContainer: {
    paddingVertical: '3%',
    paddingHorizontal: 5,
  },

  filterOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: '5%',
  },

  filterOptionText: {
    color: '#fff',
    marginRight: '5%',
  },

  playlistPickerContainer: {
    flex: 1,

    backgroundColor: '#212121',

    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 10,
  },

  playlistPicker: {
    color: '#fff',
    borderRadius: 10,
  },
});

export default Filters;
