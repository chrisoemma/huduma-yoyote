import React, {useEffect, useRef} from 'react';
import { Alert } from 'react-native';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import Geolocation from '@react-native-community/geolocation';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';

const PLACES_API_KEY = 'AIzaSyBdEZINT7lRnj8V0Xs840TMX-_3dbGqXMc';
//sd
const GooglePlacesInput = ({
  placeholder = 'Enter Location',
  setLocation,
}: any) => {
  const ref: any = useRef();

  //TODO if we choose to activate current location automatically, then we can set this
  // useEffect(() => {
  //   ref.current?.setAddressText('Some Text');
  // }, []);


  const checkLocationPermission = async () => {
    const result = await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
    if (result === RESULTS.GRANTED) {
      getCurrentLocation();
    } else {
    requestLocationPermission();
    }
  };

  const requestLocationPermission = async () => {
    const result = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
    if (result === RESULTS.GRANTED) {
      getCurrentLocation();
    }
  };

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;
        setLocation({ lat: latitude, lng: longitude });
      },
      error => {
        // Handle location retrieval error
        console.error(error.message);
        Alert.alert('Error', 'Unable to retrieve current location.');
      },
      { enableHighAccuracy: true, timeout: 30000, maximumAge: 10000 }
    );
  };
  

  return (
    <GooglePlacesAutocomplete
      ref={ref}
      placeholder={placeholder}
      keepResultsAfterBlur={true}
      enableHighAccuracyLocation={true}
      fetchDetails={true}
      onPress={(data, details = null) => {
        if (data.description === 'Current location') {
          // Handle current location press separately
          checkLocationPermission();
        } else {
          // Handle other locations
          setLocation(details?.geometry.location);
        }
      }}
      query={{
        key: PLACES_API_KEY,
        language: 'en',
        components: 'country:tz',
      }}
      currentLocation={true}
      currentLocationLabel="Current location"
      nearbyPlacesAPI="GoogleReverseGeocoding"
      renderDescription={(row: any) =>
        row.description || row.formatted_address || row.name
      }
      styles={{
        textInputContainer: {},
        textInput: {
          backgroundColor: 'white',
          width: '100%',
          borderRadius: 6,
          flexDirection: 'row',
          alignItems: 'center',
          height: 65,
          elevation: 4,
        },
        predefinedPlacesDescription: {
          color: '#1faadb',
        },
      }}
    />
  );
};

export default GooglePlacesInput;
