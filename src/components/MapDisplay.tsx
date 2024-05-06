import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, PermissionsAndroid, Image, Animated } from 'react-native';
import MapView, { Marker, Polygon } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import MapViewDirections from 'react-native-maps-directions';
import { colors } from '../utils/colors';
import {
  Pusher,
  PusherMember,
  PusherChannel,
  PusherEvent,
  PusherAuthorizerResult
} from '@pusher/pusher-websocket-react-native';
import { postClientLocation } from '../features/LocationUpdates/LocationSlice';
import { useSelector } from 'react-redux';
import { useAppDispatch,RootStateOrAny } from '../app/store';
import { extractEventName } from '../utils/utilts';
import { API_URL, GOOGLE_MAPS_API_KEY } from '../utils/config';
import { useTranslation } from 'react-i18next';


const MapDisplay = ({ onLocationUpdate,providerLastLocation,provider,requestStatus,requestLastLocation }: any) => {


  const [distance, setDistance] = useState(null);
  const [previousProviderLocation, setPreviousProviderLocation] = useState(null);
  const mapViewRef = useRef(null);

  const [userLocation, setUserLocation] = useState(null);
  const [providerLocation, setServiceProviderLocation] = useState(null);


  const STATUS_ACTIVE = ['Requested', 'Accepted', 'Comfirmed','New'];
  const STATUS_PAST=['Cancelled', 'Rejected', 'Completed'];

  const pusher = Pusher.getInstance();

  useEffect(() => {
    if (providerLastLocation) {
      setServiceProviderLocation({
        latitude: parseFloat(providerLastLocation.latitude),
        longitude: parseFloat(providerLastLocation.longitude)
      });
    }
  }, [providerLastLocation]);

  useEffect(() => {
    if (STATUS_PAST.includes(requestStatus)) {
      // Use requestLastLocation for both clientLocation and providerLocation
      setUserLocation({
        latitude: parseFloat(requestLastLocation?.client_latitude),
        longitude: parseFloat(requestLastLocation?.client_longitude)
      });
      setServiceProviderLocation({
        latitude: parseFloat(requestLastLocation?.provider_latitude),
        longitude: parseFloat(requestLastLocation?.provider_longitude)
      });
    }
  }, [requestStatus, requestLastLocation]);

  useEffect(() => {
    if (userLocation && providerLocation) {
      const calculatedDistance = calculateDistance(userLocation.latitude, userLocation.longitude, providerLocation.latitude, providerLocation.longitude);
      setDistance(calculatedDistance);
    }
  }, [userLocation, providerLocation]);
  //userLocation, providerLocation

  const { t } = useTranslation();



  const animateProviderMovement = (fromLocation, toLocation) => {
    mapViewRef?.current.animateCamera(
      {
        center: {
          latitude: (fromLocation.latitude + toLocation.latitude) / 2,
          longitude: (fromLocation.longitude + toLocation.longitude) / 2,
        },
        pitch: 45,
        heading: 90,
        altitude: 300, // Adjust the altitude as needed
        zoom: mapViewRef?.current.getCamera().zoom, // Maintain current zoom level
      },
      { duration: 1000 } // Adjust the duration of animation as needed
    );
  };


  useEffect(() => {
    if (requestStatus=='Comfirmed' && providerLocation) {
      // Animate movement only when provider location updates
      if (previousProviderLocation) {
        animateProviderMovement(previousProviderLocation, providerLocation);
      }
    }
  }, [requestStatus, providerLocation]);
  

  useEffect(() => {
    if (STATUS_ACTIVE.includes(requestStatus)) {
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
        channelName: `private-provider-location-updates-user-${provider.user_id}`,
        onSubscriptionSucceeded:(data:any)=> {
          console.log('Subscription succeeded:', data);
        },
        onSubscriptionError: (channelName, message, e) => {
          console.log(`onSubscriptionError: ${message} channelName: ${channelName} Exception: ${e}`);
        },
        onEvent: (event: PusherEvent) => {
          if (extractEventName(event.eventName) === "ProviderLocationUpdated") {
            if(event.data){
                 const parsedData = JSON.parse(event.data);
                  const latitude = parseFloat(parsedData?.providerData?.latitude);
                  const longitude = parseFloat(parsedData?.providerData?.longitude);
                  setServiceProviderLocation({ latitude:latitude, longitude:longitude });
            }
                      
          }
        },
      });

      await pusher.connect();

    } catch (e) {
      console.log(`ERROR: ${e}`);
    }
    };
    setupPusher();
    return () => {
      pusher.unsubscribe({channelName:`private-provider-location-updates-user-${provider.user_id}`});
    };
  }
  }, [requestStatus]);




  
  const { user } = useSelector(
    (state: RootStateOrAny) => state.user,
);

const dispatch = useAppDispatch();

  let data={
    client_latitude:userLocation?.latitude,
    client_longitude:userLocation?.longitude
  }
  
  
  useEffect(() => {
    if (STATUS_ACTIVE.includes(requestStatus)) {
    let watchId;

    const requestLocationPermission = async () => {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'App needs access to your location.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          watchId = Geolocation.watchPosition(
            position => {
              setUserLocation({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
              });

             data = {
                client_latitude: position.coords.latitude,
                client_longitude: position.coords.longitude,
              };

              if (position.coords) {
                dispatch(postClientLocation({ clientId: user?.client.id, data }));
              }
            },
            error => console.error(error),
            {
              enableHighAccuracy: true,
              distanceFilter: 100,
              interval: 10000,
              fastestInterval: 5000,
            }
          );
        }
      } catch (error) {
        console.error(error);
      }
    };

    requestLocationPermission();

    return () => {
     Geolocation.clearWatch(watchId);
    };
  }
  }, []);



  useEffect(() => {
    if(STATUS_ACTIVE.includes(requestStatus)){
     console.log('this runs every 15 seconds')
    const sendLocationToServer = () => {
      dispatch(postClientLocation({ clientId: user?.client.id, data }));
    };
    const intervalId = setInterval(sendLocationToServer, 15000);
    return () => clearInterval(intervalId);
  }
  }, [dispatch, user?.client.id,requestStatus]);


  useEffect(() => {
    onLocationUpdate(userLocation, providerLocation);
  }, [userLocation, providerLocation]);


  const centerLat = (userLocation?.latitude + providerLocation?.latitude) / 2;
  const centerLng = (userLocation?.longitude + providerLocation?.longitude) / 2;

  const zoomLevel = 0.02;


  const calculateDistance = (lat1, lon1, lat2, lon2) => { 
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *  
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in kilometers
    return distance.toFixed(2);
  };

  const customMapStyle = [
    {
     
      "featureType": "road",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#e0e0e0" // Grey color
        }
      ]
    },

  ];

  return (
 <View style={styles.container}>
      {userLocation && providerLocation && (
        <MapView
          ref={mapViewRef}
          style={styles.map}
          region={{
            latitude:centerLat,
            longitude:centerLng,
            latitudeDelta: zoomLevel,
            longitudeDelta: zoomLevel,
          }}
          customMapStyle={customMapStyle}
        >
          <Marker
            coordinate={userLocation}
            title={STATUS_ACTIVE.includes(requestStatus)?t(`screens:yourLocation`):t(`screens:yourLastLocation`)}
            description={ STATUS_ACTIVE.includes(requestStatus)? t(`screens:yourHere`): t(`screens:lastLocation`)}
            pinColor={colors.secondary}
          />
          <Marker
            coordinate={providerLocation}
            title={`${provider.name}`}
            description={STATUS_ACTIVE.includes(requestStatus)?t(`screens:providerIsHere`):t(`screens:providerLastLocation`)}
            pinColor={colors.primary}
          />
          <MapViewDirections
            origin={userLocation}
            destination={providerLocation}
            apikey={GOOGLE_MAPS_API_KEY}
            strokeWidth={3}
            strokeColor={colors.secondary}
           
          />

          
        </MapView>
      )}
      {!userLocation  && !providerLocation && <Text>{t('screens:loading')}...</Text>}
      {distance && <Text style={styles.distanceText}>{t('screens:distance')}: {distance} km</Text>}
    </View> 
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },

  blueDotMarker: {
    width: 40, // Set the desired width
    height: 40, 
  },
  distanceText: {
    color:colors.black,
    position: 'absolute',
    bottom: 10,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
  },

  blueDotImage: {
    width: '100%', 
    height: '100%', 
  },
});

export default MapDisplay;
