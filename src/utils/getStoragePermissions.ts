import {PermissionsAndroid, PermissionStatus, ToastAndroid} from 'react-native';

const getExternalStoragePermissions = async (errorAction = () => {}) => {
  let permissionGranted: PermissionStatus = PermissionsAndroid.RESULTS.DENIED;
  try {
    permissionGranted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,

      {
        title: 'SpotHack Storage Permission',
        message: 'Give access to your Storage to save the music.',
        buttonNegative: 'Cancel',
        buttonPositive: 'Ok',
      },
    );
  } catch (err) {
    errorAction();
    ToastAndroid.show('Error Getting Storage Permissions', ToastAndroid.LONG);
    return false;
  }

  if (PermissionsAndroid.RESULTS.GRANTED !== permissionGranted) {
    errorAction();
    ToastAndroid.show('We need Storage Permissions', ToastAndroid.LONG);

    return false;
  } else {
    return true;
  }
};

export {getExternalStoragePermissions};
