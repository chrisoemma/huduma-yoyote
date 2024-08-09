import React, { useEffect } from 'react';
import { useSelector, RootStateOrAny } from 'react-redux';
import AuthStack from './AuthNavigator';
import AppStack from './AppStack';
import { NavigationContainer, DefaultTheme, DarkTheme, ThemeProvider } from '@react-navigation/native';
import { navigationRef } from './RootNavigation';
import {Alert, Appearance, PermissionsAndroid} from 'react-native';
import { useAppDispatch } from '../app/store';
import { setTheme } from '../features/settings/ThemeSlice';
import { selectOnboardingCompleted } from '../features/onboarding/OnboardingSlice';
import OnBoardingStack from './OnboardingStack';
import { I18nextProvider } from 'react-i18next';
import i18n from '../costants/IMLocalize';
import { selectLanguage } from '../costants/languageSlice';
import NewAccountStack from './NewAccountStack';
import { postClientLocation } from '../features/LocationUpdates/LocationSlice';
import Geolocation from '@react-native-community/geolocation';
import { colors } from '../utils/colors';



const Navigation = () => {
  const { user } = useSelector((state: RootStateOrAny) => state.user);
  const { isDarkMode } = useSelector((state: RootStateOrAny) => state.theme);
  const onboardingCompleted = useSelector(selectOnboardingCompleted);
  const selectedLanguage = useSelector(selectLanguage);
  const dispatch = useAppDispatch();
  

  useEffect(() => {
  }, [user]);


  useEffect(() => {
    if(user?.client){
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
          Geolocation.getCurrentPosition(
            position => {
              const data = {
                client_latitude: position.coords.latitude,
                client_longitude: position.coords.longitude,
              };

              // Assuming you have access to dispatch here
              dispatch(postClientLocation({ clientId: user?.client?.id, data }));
            },
            error => {
              //console.error(error);
              // Alert.alert(
              //   'Error',
              //   'Failed to fetch your location. Please make sure location services are enabled.',
              //   [{ text: 'OK' }]
              // );
            },
            { enableHighAccuracy: true, timeout: 30000, maximumAge: 60000,distanceFilter: 1000 }
          );
        } else {
          Alert.alert(
            'Permission Denied',
            'Without location permission, the app cannot function properly. Please grant permission in the app settings.',
            [{ text: 'OK' }]
          );
        }
      } catch (error) {
        console.error(error);
      }
    };

   
    requestLocationPermission();
  }

  }, [user, dispatch]);

  useEffect(()=>{
    i18n.changeLanguage(selectedLanguage);
  },[])

  useEffect(() => {
    const appearanceChangeListener = Appearance.addChangeListener(({ colorScheme }) => {
              let value=false
               if(colorScheme=='dark'){
                 value=true
               }
      dispatch(setTheme(value));
    });

    return () => {
      appearanceChangeListener.remove();
    };
  }, [dispatch,isDarkMode]);


  const lightTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: 'white',
      text: 'black',
    },
  };

  const darkTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      background:colors.blackBackground,
      text: 'white',
    },
  };



  return (
    
    <I18nextProvider i18n={i18n}>
    <NavigationContainer theme={isDarkMode ? darkTheme : lightTheme} ref={navigationRef}>
    <ThemeProvider value={isDarkMode ? darkTheme : lightTheme}>
      {user?.token == null ? (
        onboardingCompleted ? (
          <AuthStack />
        ) : (
          <OnBoardingStack />
        )
      ) : (
        user?.client !== null ? (
          <AppStack />
        ) : (
          <NewAccountStack />
        )
      )}
    </ThemeProvider>
    </NavigationContainer>
    </I18nextProvider>
  );
};

export default Navigation;
