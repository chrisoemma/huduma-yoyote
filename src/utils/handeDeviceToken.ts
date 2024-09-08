// handleDeviceToken.js
import messaging from '@react-native-firebase/messaging';
import { Platform } from 'react-native';
import { postUserDeviceToken } from '../features/auth/userSlice';
import DeviceInfo from 'react-native-device-info';

export const handleDeviceToken = (dispatch, user) => {
  const retrieveDeviceToken = async () => {
    try {
      const token = await messaging().getToken();
      const userType='client';
      const uniqueId = await DeviceInfo.getUniqueId();
      const deviceName = await DeviceInfo.getModel();
      const platform = Platform.OS; 

      const data = {
         deviceToken:token,
         userId:user?.id,
         deviceName:deviceName,
         userType:userType,
         uniqueId:uniqueId,
         platform:platform
      }

      if (user) {
        dispatch(postUserDeviceToken({ userId: user?.id, data:data}));
      }
    } catch (error) {
      console.log('Error retrieving device token:', error);
    }
  };

  const handleTokenRefresh = async (token) => {
    if (user) {
      dispatch(postUserDeviceToken({ userId: user?.id, deviceToken: token }));
    }
  };

  const requestPermission = async () => {
    try {
      await messaging().requestPermission();
      retrieveDeviceToken();
    } catch (error) {
      console.log('Permission denied:', error);
    }
  };

  if (Platform.OS === 'ios') {
    requestPermission();
  } else {
    retrieveDeviceToken();
  }

  // Listen for token refresh
  const unsubscribeOnTokenRefresh = messaging().onTokenRefresh(handleTokenRefresh);

  return () => {
    unsubscribeOnTokenRefresh();
  };
};
