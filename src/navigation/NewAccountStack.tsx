import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { useSelector,RootStateOrAny } from 'react-redux';
import NewAccount from '../features/auth/NewAccount';
import WelcomeNewAccount from '../features/auth/WelcomeNewAccount';

const Stack = createNativeStackNavigator();

const screenOptions = {
  headerShown: false,
};

const NewAccountStack = () => {

  const { isFirstTimeUser } = useSelector((state: RootStateOrAny) => state.user);
   
  return (
    <Stack.Navigator initialRouteName={"Welcome new account"} screenOptions={screenOptions}>
      <Stack.Screen name="Welcome new account" component={WelcomeNewAccount} />
      <Stack.Screen name="New account" component={NewAccount} />
    </Stack.Navigator>
  );
};

export default NewAccountStack;
