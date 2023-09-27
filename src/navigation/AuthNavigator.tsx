import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import RegisterScreen from '../features/auth/Register';
import VerifyScreen from '../features/auth/Verify';
import PasswordResetScreen from '../features/auth/PasswordReset';
import LoginScreen from '../features/auth/Login';
import ForgotPasswordScreen from '../features/auth/ForgotPassword';

const Stack = createNativeStackNavigator();

const screenOptions = {
  headerShown: false,
};

const AuthStack = () => {
  return (
    <Stack.Navigator initialRouteName="Login" screenOptions={screenOptions}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Verify" component={VerifyScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="PasswordReset" component={PasswordResetScreen} />
    </Stack.Navigator>
  );
};

export default AuthStack;
