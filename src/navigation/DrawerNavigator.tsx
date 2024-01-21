import React from 'react';
import { Image, TouchableOpacity } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
//import BottomTabNavigator from './BottomTabNavigator';
import {globalStyles} from '../styles/global';
import CustomDrawerContent from './CustomDrawerContent';
import Home from '../features/home/Home';
import BottomHomeTabNavigator from './BottomHomeTabNaviagtor';
import { colors } from '../utils/colors';
import Icon from 'react-native-vector-icons/FontAwesome6';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { useSelector,RootStateOrAny } from 'react-redux';



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



const stackNavOptions: any = {

  headerShown: false,
};

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();



const DrawerNavigator=()=>{

  const { isDarkMode } = useSelector(
    (state: RootStateOrAny) => state.theme,
  );


  const drawerNavOptions: any = {

  
    headerTitle: () => (
      <Image
        source={isDarkMode? require('./../../assets/images/logo-white.png'): require('./../../assets/images/logo.png')}
        style={globalStyles().horizontalLogo}
      />
    ),
    headerLeft: () => <CustomHeaderToggle />,
    headerTitleAlign: 'center',
    headerStyle: {
      backgroundColor: colors.primary,
    },
    drawerStyle: {
      backgroundColor: isDarkMode ? colors.black : colors.whiteBackground,
      width:'60%',
    },
  };

  return (

    <Drawer.Navigator
      initialRouteName="Dashboard"
      screenOptions={drawerNavOptions}
      drawerContent={props => <CustomDrawerContent {...props}  isDarkMode={isDarkMode } />}>
      <Drawer.Screen name="Home" component={BottomHomeTabNavigator} />
    </Drawer.Navigator>
  );
}

export default DrawerNavigator;
