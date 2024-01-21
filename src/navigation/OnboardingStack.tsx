import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import OnBoarding from '../features/onboarding';

const Stack = createNativeStackNavigator();

const screenOptions = {
  headerShown: false,
};

const OnBoardingStack = () => {
  return (
    <Stack.Navigator initialRouteName="Login" screenOptions={screenOptions}>
      <Stack.Screen name="On boarding" component={OnBoarding} />
    </Stack.Navigator>
  );
};

export default OnBoardingStack;
