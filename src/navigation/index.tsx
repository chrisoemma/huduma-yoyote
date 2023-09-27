import React, { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
//import { RootStateOrAny, useSelector } from 'react-redux';
//import AuthStack from './AuthNavigator';
import AppStack from './AppStack';
import ServiceProviders from '../features/serviceproviders/ServiceProviders';
import AuthStack from './AuthNavigator';
import { useSelector,RootStateOrAny } from 'react-redux';


const Stack = createNativeStackNavigator();

const Navigation = () => {

  const { user, loading } = useSelector((state: RootStateOrAny) => state.user);

  useEffect(() => {
  }, [user]);

  return user.token == null ? <AuthStack /> : (<AppStack />);
};



export default Navigation;
