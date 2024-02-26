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
} from '@pusher/pusher-websocket-react-native';
import { postClientLocation } from '../features/LocationUpdates/LocationSlice';
import { useSelector } from 'react-redux';
import { useAppDispatch,RootStateOrAny } from '../app/store';
import { extractEventName } from '../utils/utilts';
import { API_URL, GOOGLE_MAPS_API_KEY } from '../utils/config';


const MapDisplay = ({ onLocationUpdate }: any) => {

  const [userLocation, setUserLocation] = useState(null);
  const [providerLocation, setServiceProviderLocation] = useState(
    { id: 1, name: 'Provider 1', latitude: -6.7980, longitude: 39.2219 }
    
  );

  const [isBlueDotVisible, setIsBlueDotVisible] = useState(true);
  const [blueDotMarkerKey, setBlueDotMarkerKey] = useState(0); 

  const pusher = Pusher.getInstance();

  useEffect(() => {
    const setupPusher = async () => {
      const pusher = Pusher.getInstance();
      const headers = {
        'Authorization': `Bearer ${user.token}`
      };
      await pusher.init({
        apiKey: "70f571d3d3621db1c3d0",
        cluster: "ap2",
       authEndpoint: `${API_URL}/pusher/auth`,
        onAuthorizer: async (channelName, socketId) => {
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
            const authData = await response.json();
            console.log('Auth data:', authData);
            return authData.auth;
          } catch (error) {
            console.error('Error during Pusher authentication:', error);
            throw error;
          }
        },
      });

      await pusher.connect();

      const channel = pusher.subscribe({
        channelName: "location-updates",
        onSubscriptionSucceeded:(channelName:string, data:any)=> {
          console.log('Subscription succeeded:', channelName, data);
        },
        onSubscriptionError: (channelName, message, e) => {
          console.log(`onSubscriptionError: ${message} channelName: ${channelName} Exception: ${e}`);
        },
        onEvent: (event: PusherEvent) => {
          if (extractEventName(event.eventName) === "ClientLocationUpdated") {

            if(event.data){
                 const parsedData = JSON.parse(event.data);
                  const latitude = parseFloat(parsedData.clientData.latitude);
                  const longitude = parseFloat(parsedData.clientData.longitude);
                  console.log('Received ClientLocationUpdated event:', longitude);
                  setUserLocation({ latitude:latitude, longitude:longitude });
            }
                      
          }
        },
      });
    };

    setupPusher();

    return () => {
    
      pusher.unsubscribe({channelName:`location-updates`});
    };
  }, []);




  
  const { user } = useSelector(
    (state: RootStateOrAny) => state.user,
);

const dispatch = useAppDispatch();

  let data={
    client_latitude:userLocation?.latitude,
    client_longitude:userLocation?.longitude
  }
  
  
  useEffect(() => {
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

              const data = {
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

    // Clean up watcher when component unmounts
    return () => {
      Geolocation.clearWatch(watchId);
    };
  }, []);



  useEffect(() => {
     console.log('this runs every 15 seconds')
    const sendLocationToServer = () => {
      dispatch(postClientLocation({ clientId: user?.client.id, data }));
    };
    const intervalId = setInterval(sendLocationToServer, 15000);
    return () => clearInterval(intervalId);
  }, [dispatch, user?.client.id]);
  

  useEffect(() => {
   
    //const interval = setInterval(() => {
     // setIsBlueDotVisible((prevVisible) => !prevVisible);
      setBlueDotMarkerKey((prevKey) => prevKey + 1);
 //   }, 1000);
  //  return () => clearInterval(interval);
  }, [pusher,user]);

 // const animatedProviderLocation = useRef(new Animated.Value(0)).current;

  // const animateProviderLocation = (newLocation) => {
  //   Animated.timing(animatedProviderLocation, {
  //     toValue: 1,
  //     duration: 1000, // Adjust the duration as needed
  //     useNativeDriver: false, // Set to true if possible for performance
  //   }).start(() => {
  //     setServiceProviderLocation(newLocation);
  //     animatedProviderLocation.setValue(0); // Reset the animated value for the next animation
  //   });
  // };


  // useEffect(() => {
  //   // Simulate the animation with a new location every 5 seconds
  //   const intervalId = setInterval(() => {
  //     const newLatitude = providerLocation.latitude + 0.01; 
  //     const newLongitude = providerLocation.longitude + 0.01;
  //     animateProviderLocation({ latitude: newLatitude, longitude: newLongitude });
  //   }, 5000);

  //   // Clear the interval when the component unmounts
  //   return () => clearInterval(intervalId);
  // }, [providerLocation]);



  useEffect(() => {
    onLocationUpdate(userLocation, providerLocation);
  }, [userLocation, providerLocation]);


  const centerLat = (userLocation?.latitude + providerLocation.latitude) / 2;
  const centerLng = (userLocation?.longitude + providerLocation.longitude) / 2;

  const zoomLevel = 0.20;


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

  return (
    <View style={styles.container}>
    {userLocation && (
        <MapView
            style={styles.map}
            region={{
                latitude: centerLat,
                longitude: centerLng,
                latitudeDelta: zoomLevel,
                longitudeDelta: zoomLevel * (Dimensions.get('window').width / Dimensions.get('window').height),
            }}
        >
            <Marker
                coordinate={userLocation}
                pinColor="darkblue"
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
    {!userLocation && <Text>Loading...</Text>}
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

  blueDotImage: {
    width: '100%', 
    height: '100%', 
  },
});

export default MapDisplay;
