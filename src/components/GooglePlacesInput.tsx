import React, {useEffect, useRef} from 'react';
import { Alert } from 'react-native';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';

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

  return (
    <GooglePlacesAutocomplete
      ref={ref}
      placeholder={placeholder}
      fetchDetails={true}
      onPress={(data, details = null) => {
        // 'details' is provided when fetchDetails = true
        setLocation(details?.geometry.location);
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
