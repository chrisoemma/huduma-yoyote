import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FontAwesome5 from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/Feather';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Home from '../features/home/Home';
import { colors } from '../utils/colors';
import { useTranslation } from 'react-i18next';
import CategoryScreen from '../features/category/CategoryScreen';
import Requests from '../features/requests/Requests';
import Account from '../features/account/Account';


const Tab = createBottomTabNavigator();

const screenOptions = {
  headerShown: false,
};

const Stack = createNativeStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator initialRouteName="Home" screenOptions={screenOptions}>
      <Stack.Screen name="Home" component={Home} />
    </Stack.Navigator>
  );
};


const tabNavScreenOptions = ({ route }: any) => ({
  headerShown: false,
  tabBarIcon: ({ focused, color, size }: any) => {
    let iconName;

    if (route.name === 'Home') {
      iconName = 'home';
      return <Icon name={iconName as string} size={size} color={color} />;
    } else if (route.name === 'Requests') {
      iconName = 'rotate-3d-variant';
    } else if (route.name === 'Account') {
      iconName = 'account-circle';
    } 
    // You can return any component that you like here!
    return <FontAwesome5 name={iconName as string} size={size} color={color} />;
  },
  tabBarActiveTintColor: colors.secondary,
  tabBarInactiveTintColor: 'gray',
});

export default function BottomHomeTabNavigator() {
  const { t } = useTranslation();
  return (
    <Tab.Navigator screenOptions={tabNavScreenOptions}>
      <Tab.Screen name="Home" 
      component={HomeStack}
      options={{ tabBarLabel: t('navigate:home') }}
       />
      <Tab.Screen 
      name="Requests" 
      component={Requests}
      options={{ tabBarLabel: t('navigate:requests') }}
      />
      <Tab.Screen 
      name="Account" 
      component={Account}
      options={{ tabBarLabel: t('navigate:account') }}
      />
    </Tab.Navigator>
  );
}
