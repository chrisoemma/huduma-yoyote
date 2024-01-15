import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, PermissionsAndroid } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import MapViewDirections from 'react-native-maps-directions';
import { colors } from '../utils/colors';
import {
  Pusher,
  PusherMember,
  PusherChannel,
  PusherEvent,
} from '@pusher/pusher-websocket-react-native';
import { useSelector } from 'react-redux';
import { useAppDispatch,RootStateOrAny } from '../app/store';
import { postClientLocation } from '../features/LocationUpdates/LocationSlice';


const MapDisplay = ({ onLocationUpdate }: any) => {

  const [userLocation, setUserLocation] = useState(null);
  const [providerLocation, setServiceProvidersLocation] = useState(
    { id: 1, name: 'Provider 1', latitude: -6.7980, longitude: 39.2219 }
  );
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
             console.log('running this for firt time');
             console.log('dataaaa',data)
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
      const pusher = Pusher.getInstance();
      await pusher.init({
        apiKey: "70f571d3d3621db1c3d0",
        cluster: "ap2",
      });

      await pusher.connect();

      const channelName = "location-updates";

      if (channelName) {
        const channel = pusher.subscribe({
          channelName,
          onEvent: (event: PusherEvent) => {
             console.log('evenntss',event)
            if (event.eventName === "ClientLocationUpdated") {
              const { client_latitude, client_longitude } = event.data;
              setUserLocation({ client_latitude, client_longitude });
            } else if (event.eventName === "ProviderLocationUpdated") {
              const { id, name, latitude, longitude } = event.data;
              setServiceProvidersLocation({ id, name, latitude, longitude });
            }
          },
        });
      } else {
        console.error("Channel name is null");
      }
    };

    //   const channel = pusher.subscribe({
    //     channelName: "location-updates",
    //     onEvent: (event: PusherEvent) => {
    //       if (event.eventName === "ClientLocationUpdated") {
    //         const { client_latitude, client_longitude } = event.data;
    //         setUserLocation({ client_latitude, client_longitude });
    //       } else if (event.eventName === "ProviderLocationUpdated") {
    //         const { id, name, latitude, longitude } = event.data;
    //         setServiceProvidersLocation({ id, name, latitude, longitude });
    //       }
    //     },
    //   });
    // };

    setupPusher();

    return () => {
      const pusher = Pusher.getInstance();
      pusher.unsubscribe('location-updates');
    };
  }, []);


  useEffect(() => {
    onLocationUpdate(userLocation, providerLocation);
  }, [userLocation, providerLocation]);



  // useEffect(() => {
  //   const intervalId = setInterval(() => {
  //      console.log('running this')
  //     if (userLocation) {
  //       dispatch(postClientLocation({clientId:user?.client.id,data}));
  //     }
  //   }, 30000);

    // Clean up interval when component unmounts
  //   return () => clearInterval(intervalId);
  // }, [userLocation]);


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

          {/* Draw Polyline for the route */}
          <Polyline
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
});

export default MapDisplay;
