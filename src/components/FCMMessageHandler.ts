import React, { useEffect } from 'react';
import messaging from '@react-native-firebase/messaging';
import { useSelector, RootStateOrAny } from 'react-redux';
import { setUserAccountStatus } from '../features/auth/userSlice';
import { useAppDispatch } from '../app/store';
import { setRequestStatus } from '../features/requests/RequestSlice';

const FCMMessageHandler = () => {
  const { user } = useSelector((state: RootStateOrAny) => state.user);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const unsubscribeForeground = messaging().onMessage(async remoteMessage => {
      handleRemoteMessage(remoteMessage);
    });

    // Handle messages when the app is in the background or terminated
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      handleRemoteMessage(remoteMessage);
    });

    return () => {
      unsubscribeForeground();
    };
  }, []);

  const handleRemoteMessage = remoteMessage => {
    const { data,notification } = remoteMessage;

     console.log('datatatatata',data);

    if (data && data.type) {
      const type = data.type;
      // Perform actions based on the type
      switch (type) {
        case 'user_status_changed':
          dispatch(setUserAccountStatus(data.userStatus));
          break;
        case 'request_status_changed':
             dispatch(setRequestStatus(data.request))
          break;
        case 'service_approval':
          //Find that subservice by id then update its status
          break;
        case 'subscription_status':
            //Find user active subscription status and update  it to expired
          break;
        default:
          // Handle other types or default case
          break;
      }
    }
  };

  return null;
};

export default FCMMessageHandler;
