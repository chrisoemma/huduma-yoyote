import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, PermissionsAndroid, Image, Animated } from 'react-native';
import MapView, { AnimatedRegion, Marker, Polygon } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import MapViewDirections from 'react-native-maps-directions';
import { colors } from '../utils/colors';
import {
  Pusher,
  PusherEvent,
  PusherAuthorizerResult
} from '@pusher/pusher-websocket-react-native';
import { postClientLocation } from '../features/LocationUpdates/LocationSlice';
import { useSelector } from 'react-redux';
import { useAppDispatch, RootStateOrAny } from '../app/store';
import { extractEventName } from '../utils/utilts';
import { API_URL, GOOGLE_MAPS_API_KEY } from '../utils/config';
import { useTranslation } from 'react-i18next';


const MapDisplay = ({ onLocationUpdate, providerLastLocation, provider, requestStatus, requestLastLocation }) => {
  const [distance, setDistance] = useState(null);
  const mapViewRef = useRef(null);
  const markerRef = useRef(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [isMoving, setIsMoving] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [providerLocation, setServiceProviderLocation] = useState(null);
  const [previousLocation, setPreviousLocation] = useState(null);
  const [lastUpdateTime, setLastUpdateTime] = useState(Date.now());


  const STATUS_ACTIVE = ['Requested', 'Accepted', 'Comfirmed', 'New'];
  const STATUS_PAST = ['Cancelled', 'Rejected', 'Completed'];

  const pusher = Pusher.getInstance();

  const debounce = (func, delay) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), delay);
    };
  };

  useEffect(() => {
    if (providerLastLocation) {
      const newLocation = {
        latitude: parseFloat(providerLastLocation.latitude),
        longitude: parseFloat(providerLastLocation.longitude)
      };

      if (!isNaN(newLocation?.latitude) && !isNaN(newLocation?.longitude)) {
        const updateLocation = debounce(() => {
          setServiceProviderLocation(newLocation);
          // Animate the marker to the new provider location
          animatedCoordinate.timing({
            latitude: newLocation.latitude,
            longitude: newLocation.longitude,
            duration: 500,
            useNativeDriver: false,
          }).start();
        }, 300); // Adjust delay as needed

        updateLocation();
      }
    }
  }, [providerLastLocation]);



  const animatedCoordinate = useRef(
    new AnimatedRegion({
      latitude: providerLocation?.latitude || 0,
      longitude: providerLocation?.longitude || 0,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    })
  ).current;

  // console.log('provider location', providerLocation)
  // console.log('animated coordinate', animatedCoordinate);


  // console.log('animated coordinate last', animatedCoordinate);

  useEffect(() => {
    if (STATUS_PAST.includes(requestStatus)) {
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

  const { t } = useTranslation();

  useEffect(() => {
    let intervalId;

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
              return newAuthData;
            } catch (error) {
              console.error('Error during Pusher authentication:', error);
              throw error;
            }
          },
        });

        const channel = pusher.subscribe({
          channelName: `private-provider-location-updates-user-${provider.user_id}`,
          onSubscriptionSucceeded: (data) => { },
          onSubscriptionError: (channelName, message, e) => { },
          onEvent: (event: PusherEvent) => {
            if (extractEventName(event.eventName) === "ProviderLocationUpdated") {
              if (event.data) {
                const parsedData = JSON.parse(event.data);
                const newLatitude = parseFloat(parsedData?.providerData?.latitude);
                const newLongitude = parseFloat(parsedData?.providerData?.longitude);
                const newLocation = { latitude: newLatitude, longitude: newLongitude };

                // Update the last update time
                setLastUpdateTime(Date.now());

                // Calculate movement
                if (previousLocation) {
                  const distance = calculateDistance(
                    previousLocation.latitude,
                    previousLocation.longitude,
                    newLatitude,
                    newLongitude
                  );

                  // Set isMoving based on distance threshold
                  setIsMoving(distance > 0.01); // Adjust the threshold as needed
                }

                // Update locations
                setPreviousLocation(newLocation);
                setServiceProviderLocation(newLocation);

                // Animate marker
                if (requestStatus === 'Comfirmed') {
                  animatedCoordinate.timing({
                    latitude: newLatitude,
                    longitude: newLongitude,
                    duration: 500,
                    useNativeDriver: false,
                  }).start();
                }
              }
            }
          },
        });

        await pusher.connect();

      } catch (e) {
        console.error(`ERROR: ${e}`);
      }
    };

    if (STATUS_ACTIVE.includes(requestStatus)) {
      setupPusher();

      // Set up an interval to check for location updates
      intervalId = setInterval(() => {
        const currentTime = Date.now();
        const timeSinceLastUpdate = currentTime - lastUpdateTime;

        // Check if it's been more than 5 seconds since the last update
        if (timeSinceLastUpdate > 5000) {
          setIsMoving(false);
        }
      }, 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
      pusher.unsubscribe({ channelName: `private-provider-location-updates-user-${provider.user_id}` });
    };
  }, [requestStatus, lastUpdateTime]);

  const { user } = useSelector(
    (state: RootStateOrAny) => state.user,
  );

  const dispatch = useAppDispatch();

  let data = {
    client_latitude: userLocation?.latitude,
    client_longitude: userLocation?.longitude
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
    if (STATUS_ACTIVE.includes(requestStatus)) {
      // console.log('this runs every 15 seconds')
      const sendLocationToServer = () => {
        dispatch(postClientLocation({ clientId: user?.client.id, data }));
      };
      const intervalId = setInterval(sendLocationToServer, 15000);
      return () => clearInterval(intervalId);
    }
  }, [dispatch, user?.client.id, requestStatus]);

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

  useEffect(() => {
    if (userLocation && providerLocation) {
      const bounds = {
        latitude: (userLocation?.latitude + providerLocation?.latitude) / 2,
        longitude: (userLocation?.longitude + providerLocation?.longitude) / 2,
        latitudeDelta: Math.abs(userLocation?.latitude - providerLocation?.latitude) * 1.5,
        longitudeDelta: Math.abs(userLocation?.longitude - providerLocation?.longitude) * 1.5,
      };
      mapViewRef?.current?.fitToCoordinates([userLocation, providerLocation], {
        edgePadding: { top: 100, right: 50, bottom: 50, left: 50 },
        animated: true,
      });
    }
  }, [userLocation, providerLocation]);

  const shouldUpdateDirections = (oldLocation, newLocation) => {
    if (!oldLocation || !newLocation) return true;
    const distance = calculateDistance(
      oldLocation?.latitude,
      oldLocation?.longitude,
      newLocation?.latitude,
      newLocation?.longitude
    );
    return distance > 0.05;
  };

  // console.log('provider location',providerLocation)
  // console.log('centerLatitude',centerLat)
  // console.log('centerLongitude',centerLng)
  // console.log('userLocation',userLocation)
  // console.log('animatedRegion',animatedCoordinate)


  return (

    <View style={styles.container}>
      {userLocation && providerLocation && (
        <MapView
          ref={mapViewRef}
          style={styles.map}
          initialRegion={{
            latitude: centerLat,
            longitude: centerLng,
            latitudeDelta: zoomLevel,
            longitudeDelta: zoomLevel,
          }}
          customMapStyle={customMapStyle}
        >
          <Marker
            coordinate={userLocation}
            title={STATUS_ACTIVE.includes(requestStatus) ? t(`screens:yourLocation`) : t(`screens:yourLastLocation`)}
            description={STATUS_ACTIVE.includes(requestStatus) ? t(`screens:yourHere`) : t(`screens:lastLocation`)}
            pinColor={colors.secondary}
          />
          <Marker.Animated
            ref={markerRef}
            coordinate={animatedCoordinate}
            title={`${provider.name}`}
            description={STATUS_ACTIVE.includes(requestStatus) ? t(`screens:providerIsHere`) : t(`screens:providerLastLocation`)}
            pinColor={colors.primary}
          >
            <Image source={isMoving ? require('../../assets/images/personmove.png') : require('../../assets/images/personstanding.png')} style={{ width: 20, height: 20 }} />
          </Marker.Animated>
          <MapViewDirections
            origin={providerLocation}
            destination={userLocation}
            apikey={GOOGLE_MAPS_API_KEY}
            strokeWidth={3}
            strokeColor={colors.secondary}
            onReady={(result) => {
              if (shouldUpdateDirections(previousLocation, providerLocation)) {
                //  setRouteCoordinates(result.coordinates);
                mapViewRef.current.fitToCoordinates(result.coordinates, {
                  edgePadding: {
                    top: 100,
                    right: 50,
                    bottom: 50,
                    left: 50,
                  },
                });
              }
            }}
          />
        </MapView>
      )}
      {!userLocation && !providerLocation && <Text>{t('screens:loading')}...</Text>}
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
    width: 40, 
    height: 40,
  },
  distanceText: {
    color: colors.black,
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

