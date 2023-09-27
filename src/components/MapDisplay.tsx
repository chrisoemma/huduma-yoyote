import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, PermissionsAndroid } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import MapViewDirections from 'react-native-maps-directions';
import { colors } from '../utils/colors';


const MapDisplay = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [provider, setServiceProviders] = useState(
    { id: 1, name: 'Provider 1', latitude: -6.7980, longitude: 39.2219 }
    // { id: 2, name: 'Provider 2', latitude: -6.7794, longitude: 39.2277 },
    // Add more service providers...
  );

  useEffect(() => {
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
          // Permission granted, start fetching location
          const watchId = Geolocation.watchPosition(
            position => {
              setUserLocation({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
              });
              console.log('latitude',position.coords.latitude);
              console.log('longitude',position.coords.longitude)
            },
            error => console.error(error),
            {
              enableHighAccuracy: true,
              distanceFilter: 100, // Update every 100 meters
              interval: 10000, // Update every 10 seconds
              fastestInterval: 5000, // Fastest update interval
            }
          );
        } else {
          console.log('Location permission denied');
        }
      } catch (error) {
        console.error(error);
      }
    };

    requestLocationPermission();

    return () => {
      Geolocation.stopObserving();
    };
  }, []);


  const centerLat = (userLocation?.latitude + provider.latitude) / 2;
  const centerLng = (userLocation?.longitude + provider.longitude) / 2;

  const zoomLevel = 0.7;


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

  // Rest of the code remains the same...

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
            latitude: provider.latitude,
            longitude: provider.longitude,
          }}
          title={provider.name}
          description={`Distance: ${calculateDistance(
            userLocation.latitude,
            userLocation.longitude,
            provider.latitude,
            provider.longitude
          )} km`}
        />

        {/* Draw Polyline for the route */}
        <Polyline
          coordinates={[
            { latitude: userLocation.latitude, longitude: userLocation.longitude },
            { latitude: provider.latitude, longitude: provider.longitude },
          ]}
          strokeColor={colors.secondary}
          strokeWidth={4}
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
