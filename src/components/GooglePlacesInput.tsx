import React, {useEffect, useRef} from 'react';
import { Alert } from 'react-native';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import Geolocation from '@react-native-community/geolocation';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { useTranslation } from 'react-i18next';
import { getLocationName } from '../utils/utilts';


const PLACES_API_KEY = 'AIzaSyBdEZINT7lRnj8V0Xs840TMX-_3dbGqXMc';
//sd
const GooglePlacesInput = ({
  placeholder = 'Enter Location',
  setLocation,
  defaultValue,
}: any) => {
  const ref: any = useRef();

  useEffect(() => {
    if (defaultValue) {
      getLocationName(defaultValue.latitude, defaultValue.longitude)
        .then(locationName => {
          ref.current?.setAddressText(locationName);
        })
        .catch(error => {
          console.error('Error fetching location name:', error);
        });
    }
  }, [defaultValue, ref]);

  const { t } = useTranslation();

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
      fetchDetails={true}
      enablePoweredByContainer={false}
      onPress={(data, details = null) => {
        if (data.description === 'Current location') {
          checkLocationPermission();
        } else {
          setLocation(details?.geometry.location);
        }
      }}
      query={{
        key: PLACES_API_KEY,
        language: 'en',
        components: 'country:tz',
      }}
      currentLocation={true}
      currentLocationLabel={t('screens:currentLocation')}
      nearbyPlacesAPI="GoogleReverseGeocoding"
      renderDescription={(row: any) =>
        row.description || row.formatted_address || row.name
      }
      textInputProps={{
        placeholderTextColor: 'gray',
        returnKeyType: 'search',
      }}
      
      styles={{
        textInputContainer: {},
        textInput: {
          backgroundColor: 'white',
          color: 'black',
          width: '100%',
          borderRadius: 6,
          flexDirection: 'row',
          alignItems: 'center',
          height: 65,
          elevation: 4,
        },
        listView: {
          backgroundColor: 'white', 
          color: 'black', 
          zIndex: 100000
        },
        row:{
          description: { color: 'gray'},
        },
        description: { color: 'gray' },
        predefinedPlacesDescription: {
          color: '#1faadb',
        },
      }}
    />
  );
};

export default GooglePlacesInput;
