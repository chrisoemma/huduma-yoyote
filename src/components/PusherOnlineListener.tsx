import React, { useEffect } from 'react';
import { useDispatch, useSelector,RootStateOrAny } from 'react-redux';
import { setUserOnlineStatus } from '../features/auth/userSlice';
import {
    Pusher,
    PusherMember,
    PusherChannel,
    PusherEvent,
    PusherAuthorizerResult
  } from '@pusher/pusher-websocket-react-native';
import { API_URL } from '../utils/config';
import { extractEventName } from '../utils/utilts';

const PusherOnlineListener = ({remoteUserId}:any) => {

  console.log('remote user',remoteUserId);

  const dispatch = useDispatch();
  const { user } = useSelector((state:RootStateOrAny) => state.user);
  const pusher = Pusher.getInstance();

  useEffect(() => {
    const setupPusher = async () => {
      const headers = {
        'Authorization': `Bearer ${user.token}`,
      };

      try {
        await pusher.init({
            apiKey: "70f571d3d3621db1c3d0",
            cluster: "ap2",
             authEndpoint: `${API_URL}/pusher/auth`,
            onAuthorizer: async (channelName, socketId) => {
              console.log('trying to authorize')
              try {
                const response = await fetch(`${API_URL}/pusher/auth`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    ...headers,
                  },
                  body: JSON.stringify({
                    socket_id: socketId,
                    channel_name: channelName,
                    userId: user.id
                  }),
                });
                if (!response.ok) {
                  throw new Error('Network response was not ok');
                }
                const authData = await response.json() as PusherAuthorizerResult
                const newAuthData = JSON.parse(authData);
                console.log('new authata',newAuthData)
                return newAuthData
              } catch (error) {
                console.error('Error during Pusher authentication:', error);
                throw error;
              }
            },
          });
        const channel = pusher.subscribe({
          channelName: `private-user-online-status-${remoteUserId}`,
          onSubscriptionSucceeded: (data) => {
            console.log('Subscription succeeded:', data);
          },
          onSubscriptionError: (channelName, message, e) => {
            console.log(`onSubscriptionError: ${message} channelName: ${channelName} Exception: ${e}`);
          },
          onEvent: (event) => {
            if (extractEventName(event.eventName) === "UserOnlineStatusUpdated") {
              if (event.data) {
                const parsedData = JSON.parse(event.data);
                console.log('paserdddd data',parsedData);
                const isOnline = parsedData?.isOnline;
                dispatch(setUserOnlineStatus(isOnline));
              }
            }
          },
        });
        await pusher.connect();
      } catch (e) {
        console.log(`ERROR: ${e}`);
      }
    };

    if (user) {
      setupPusher();
    }

    return () => {
      if (user) {
        pusher.unsubscribe({ channelName: `private-user-online-status-${remoteUserId}` });
      }
    };
  }, [user, dispatch]);

  return null; 
};

export default PusherOnlineListener;
