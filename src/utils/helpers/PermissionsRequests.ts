import { sendErrorLog, sendInfoLog } from 'api/LoggerRequests';
import { PermissionsAndroid } from 'react-native';

export const requestCameraPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA, {
      title: 'Camera Permission',
      message: 'ABC Fintrad needs access to your camera to scan debit cards and add it to the app.',
      buttonNeutral: 'Ask Me Later',
      buttonNegative: 'Cancel',
      buttonPositive: 'OK',
    });
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      await sendInfoLog({
        event: 'Request Camera Permission',
        detail: 'You can use the camera',
      });
    } else {
      await sendInfoLog({
        event: 'Request Camera Permission',
        detail: 'Camera permission denied',
      });
    }
  } catch (err: any) {
    await sendErrorLog({
      event: 'Request Camera Permission',
      detail: err.toString(),
    });
  }
};
