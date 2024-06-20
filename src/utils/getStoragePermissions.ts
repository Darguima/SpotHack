import {PermissionsAndroid, Platform, ToastAndroid} from 'react-native';

const getExternalStoragePermissions = async (errorAction = () => {}) => {
  const permissionType =
    Number(Platform.Version) >= 33
      ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_AUDIO
      : PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;

  try {
    const permissionGranted = await PermissionsAndroid.request(
      permissionType,

      {
        title: 'SpotHack Storage Permission',
        message: 'Give access to your Storage to save the music.',
        buttonNegative: 'Cancel',
        buttonPositive: 'Ok',
      },
    );

    if (PermissionsAndroid.RESULTS.GRANTED !== permissionGranted) {
      errorAction();
      ToastAndroid.show('We need Storage Permissions', ToastAndroid.LONG);
    }

    return PermissionsAndroid.RESULTS.GRANTED === permissionGranted;
  } catch (err) {
    errorAction();
    ToastAndroid.show('Error Getting Storage Permissions', ToastAndroid.LONG);
    return false;
  }
};

export {getExternalStoragePermissions};
