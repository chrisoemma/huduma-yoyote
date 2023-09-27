import React from 'react';
import { Image, TouchableOpacity } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
//import BottomTabNavigator from './BottomTabNavigator';
import { globalStyles } from '../styles/global';
import CustomDrawerContent from './CustomDrawerContent';
import Home from '../features/home/Home';
import BottomHomeTabNavigator from './BottomHomeTabNaviagtor';
import { colors } from '../utils/colors';
import Icon from 'react-native-vector-icons/FontAwesome6';
import { DrawerActions, useNavigation } from '@react-navigation/native';



function CustomHeaderToggle() {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.dispatch(DrawerActions.toggleDrawer());
      }}
    >
      <Icon
        name="bars-staggered"
        size={24} color={colors.white}
        style={{ marginLeft: 10 }}
      />
    </TouchableOpacity>
  );
}



const drawerNavOptions: any = {
  headerTitle: () => (
    <Image
      source={require('./../../assets/images/logo.jpg')}
      style={globalStyles.horizontalLogo}
    />
  ),
  headerLeft: () => <CustomHeaderToggle />,
  headerTitleAlign: 'center',
  headerStyle: {
    backgroundColor: colors.primary,
  },
  drawerStyle: {
    backgroundColor:colors.whiteBackground,
    width:'60%',
  },
};

const stackNavOptions: any = {

  headerShown: false,
};

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();



function DrawerNavigator() {

  return (

    <Drawer.Navigator
      initialRouteName="Dashboard"
      screenOptions={drawerNavOptions}
      drawerContent={props => <CustomDrawerContent {...props} />}>
      <Drawer.Screen name="Home" component={BottomHomeTabNavigator} />
      {/* <Drawer.Screen name="Check-in/Check-out" component={DashboardStack} />
      <Drawer.Screen name="Live tracking" component={DashboardStack} />
      <Drawer.Screen name="Tasks" component={DashboardStack} /> */}
    </Drawer.Navigator>
  );
}

export default DrawerNavigator;
