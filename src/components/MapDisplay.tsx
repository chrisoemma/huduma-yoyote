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
import { API_URL } from '../utils/config';


const MapDisplay = ({ onLocationUpdate }: any) => {

  const [userLocation, setUserLocation] = useState(null);
  const [providerLocation, setServiceProviderLocation] = useState(
    { id: 1, name: 'Provider 1', latitude: -6.7980, longitude: 39.2219 }
    
  );

  const [isBlueDotVisible, setIsBlueDotVisible] = useState(true);
  const [blueDotMarkerKey, setBlueDotMarkerKey] = useState(0); 

  const pusher = Pusher.getInstance();

  
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
        // ... (your existing code)
  
        watchId = Geolocation.watchPosition(
          position => {
            setUserLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
  
            data={
              client_latitude:position.coords.latitude,
              client_longitude:position.coords.longitude
             }
               if(position.coords){
             dispatch(postClientLocation({clientId:user?.client.id,data}));
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
    const setupPusher = async () => {
      const headers = {
        'Authorization': `Bearer ${user.token}`
      };

  
    
      try {
        await pusher.init({
          apiKey: "70f571d3d3621db1c3d0",
          cluster: "ap2",
          authEndpoint: `${API_URL}/pusher/auth`,
          onAuthorizer: (channelName, socketId) => {
            return fetch(`${API_URL}/pusher/auth`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                ...headers,
              },
              body: JSON.stringify({
                socket_id: socketId,
                channel_name: channelName,
              }),
            })
            .then(response => response.json())
            .then(authData => {
              console.log('Auth data:', authData);
              return authData;
            })
            .catch(error => {
              console.error('Error during Pusher authentication:', error);
              throw error;
            });
          },
          // other pusher configuration options...
        });
    
        const myChannel = await pusher.subscribe({
          channelName: `private-location-updates.${user.id}`,
          headers: headers,
          onSubscriptionSucceeded: (channelName, data) => {
            console.log('Subscription succeeded:', channelName, data);
          },
          onSubscriptionError: (channelName, message, e) => {
            console.log(`onSubscriptionError: ${message} channelName: ${channelName} Exception: ${e}`);
          },
          onEvent: (event: PusherEvent) => {
            if (extractEventName(event.eventName) === "ClientLocationUpdated") {
              if (event.data) {
                const parsedData = JSON.parse(event.data);
                const latitude = parseFloat(parsedData.client_location.latitude);
                const longitude = parseFloat(parsedData.client_location.longitude);
                console.log('Received ClientLocationUpdated event:', longitude);
                setUserLocation({ latitude, longitude });
              }
            }
          },
        });
    
        await pusher.connect();
      } catch (e) {
        console.log(`ERROR: ${e}`);
      }
    };
    
    setupPusher() 
    return () => {
    //  await pusher.reset();
     pusher.unsubscribe({channelName:`private-location-updates.${user.id}`});
    };
  },[]);

  useEffect(() => {
   
    const interval = setInterval(() => {
      setIsBlueDotVisible((prevVisible) => !prevVisible);
      setBlueDotMarkerKey((prevKey) => prevKey + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const animatedProviderLocation = useRef(new Animated.Value(0)).current;

  const animateProviderLocation = (newLocation) => {
    Animated.timing(animatedProviderLocation, {
      toValue: 1,
      duration: 1000, // Adjust the duration as needed
      useNativeDriver: false, // Set to true if possible for performance
    }).start(() => {
      setServiceProviderLocation(newLocation);
      animatedProviderLocation.setValue(0); // Reset the animated value for the next animation
    });
  };


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
  {isBlueDotVisible && (
  <Marker
    key={`blueDotMarker_${blueDotMarkerKey}`}
    coordinate={{
      latitude: userLocation.latitude,
      longitude: userLocation.longitude,
    }}
    anchor={{ x: 0.5, y: 0.5 }} 
    style={styles.blueDotMarker} 
  >
    <Image
      source={require('../../assets/images/dot.jpg')}
      style={styles.blueDotImage} 
    />
  </Marker>
)}
     

   <Marker
              coordinate={{
                latitude: providerLocation.latitude,
                longitude: providerLocation.longitude,
              }}
            title={providerLocation.name}
            description={`Distance: ${calculateDistance(
              userLocation.latitude,
              userLocation.longitude,
              providerLocation.latitude,
              providerLocation.longitude
            )} km`
            }
            pinColor="darkblue"
          />

          
          <Polygon
            coordinates={[
              { latitude: userLocation.latitude, longitude: userLocation.longitude },
              { latitude: providerLocation.latitude, longitude: providerLocation.longitude },
            ]}
            strokeColor={colors.secondary}
            strokeWidth={3}
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
