import React, { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector, RootStateOrAny } from 'react-redux';
import AuthStack from './AuthNavigator';
import AppStack from './AppStack';
import { NavigationContainer, DefaultTheme, DarkTheme, ThemeProvider } from '@react-navigation/native';
import { navigationRef } from './RootNavigation';
import {Appearance} from 'react-native';
import { useAppDispatch } from '../app/store';
import { setTheme } from '../features/settings/ThemeSlice';
import { selectOnboardingCompleted } from '../features/onboarding/OnboardingSlice';
import OnBoardingStack from './OnboardingStack';
import { I18nextProvider } from 'react-i18next';
import i18n from '../costants/IMLocalize';
import { selectLanguage } from '../costants/languageSlice';



const Navigation = () => {
  const { user } = useSelector((state: RootStateOrAny) => state.user);
  const { isDarkMode } = useSelector((state: RootStateOrAny) => state.theme);
  const onboardingCompleted = useSelector(selectOnboardingCompleted);
  const selectedLanguage = useSelector(selectLanguage);
  const dispatch = useAppDispatch();
  

  useEffect(() => {
  }, [user]);



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
      // Add any other custom light mode colors
    },
  };

  const darkTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      background: 'black',
      text: 'white',
    },
  };



  return (
    
    <I18nextProvider i18n={i18n}>
    <NavigationContainer theme={isDarkMode ? darkTheme : lightTheme} ref={navigationRef}>
      <ThemeProvider value={isDarkMode ? darkTheme : lightTheme}>
        {user.token == null ? (
          onboardingCompleted ? (
            <AuthStack />
          ) : (
            <OnBoardingStack />
          )
        ) : (
          <AppStack />
        )}
      </ThemeProvider>
    </NavigationContainer>
    </I18nextProvider>
  );
};

export default Navigation;
