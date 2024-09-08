import React, { useEffect } from 'react';
import messaging from '@react-native-firebase/messaging';
import { useSelector, RootStateOrAny } from 'react-redux';
import { changeNidaStatus, logoutOtherDevice, setUserChanges, updateClientChanges } from '../features/auth/userSlice';
import { useAppDispatch } from '../app/store';
import { setRequestStatus } from '../features/requests/RequestSlice';
import { setClientChanges } from '../features/account/ClientSlice';
import { unflatten } from '../utils/utilts';
import { useNavigation } from '@react-navigation/native';
import { addNotification } from '../features/Notifications/NotificationSlice';

const FCMMessageHandler = () => {
  const { user } = useSelector((state: RootStateOrAny) => state.user);
  const dispatch = useAppDispatch();
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribeForeground = messaging().onMessage(async remoteMessage => {
      handleRemoteMessage(remoteMessage);
    });

    // Handle messages when the app is in the background or terminated
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      handleRemoteMessage(remoteMessage);
    });

    // Listen for notification clicks
    const unsubscribeNotificationOpened = messaging().onNotificationOpenedApp(remoteMessage => {
      handleNotificationClick(remoteMessage);
    });

    // Check if notification caused app to open from a closed state
    messaging().getInitialNotification().then(remoteMessage => {
      if (remoteMessage) {
        handleNotificationClick(remoteMessage);
      }
    });

    return () => {
      unsubscribeForeground();
      unsubscribeNotificationOpened();
    };
  }, []);

  const handleRemoteMessage = remoteMessage => {
    const { data, notification } = remoteMessage;

    if (data && data.type) {
      const type = data.type;
      if(data?.notification_type){
        const notificationData = {
          id: data.id,
          type: data.notification_type,
          title: data.title,
          message: data.message,
          viewed: false,
        };
        dispatch(addNotification(notificationData));
      }
      switch (type) {
        case 'account_changed':

          const userChanges = data.userChanges ? JSON.parse(data.userChanges) : {};
          const clientChanges = data.clientChanges ? JSON.parse(data.clientChanges) : {};
          dispatch(setUserChanges(userChanges));
          dispatch(setClientChanges(clientChanges));
          dispatch(updateClientChanges(clientChanges))
          break;
        case 'request_status_changed':
          dispatch(setRequestStatus(data.request))
          break;
        case 'logout_device':
          dispatch(logoutOtherDevice());
        case 'nida_status_chaged':
          dispatch(changeNidaStatus(data.nidaStatus))
          break;
        default:
          // Handle other types or default case
          break;
      }
    }
  };

  const handleNotificationClick = remoteMessage => {
    const { data } = remoteMessage;
    if (data && data.type) {
      navigation.navigate('Notifications');
    }
  };

  return null;
};

export default FCMMessageHandler;
