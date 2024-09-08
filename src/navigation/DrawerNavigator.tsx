import React from 'react';
import { View, Image, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { globalStyles } from '../styles/global';
import CustomDrawerContent from './CustomDrawerContent';
import BottomHomeTabNavigator from './BottomHomeTabNaviagtor';
import { colors } from '../utils/colors';
import Icon from 'react-native-vector-icons/FontAwesome6';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { useSelector, RootStateOrAny } from 'react-redux';

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

const NotificationBell = ({ notificationCount, onPress }: any) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.notificationContainer}>
      <Icon name="bell" size={24} color={colors.white} />
      {notificationCount > 0 && (
        <View style={styles.notificationBadge}>
          <Text style={styles.notificationText}>{notificationCount}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const stackNavOptions: any = {
  headerShown: false,
};

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  const { isDarkMode } = useSelector((state: RootStateOrAny) => state.theme);
  const notifications = useSelector((state: RootStateOrAny) => state.notifications.notifications);
  const navigation = useNavigation();

  // Get notification count from notifications state
  const notificationCount = notifications.filter(notification => !notification.viewed).length;

  const handleBellPress = () => {
    navigation.navigate('Notifications'); 
  };

  const drawerNavOptions: any = {
    headerTitle: () => (
      <View style={styles.headerTitleContainer}>
        <Image
          source={require('./../../assets/images/logo-white.png')}
          style={globalStyles().horizontalLogo}
        />
        <NotificationBell
          notificationCount={notificationCount}
          onPress={handleBellPress}
        />
      </View>
    ),
    headerLeft: () => <CustomHeaderToggle />,
    headerTitleAlign: 'center',
    headerStyle: {
      backgroundColor: colors.secondary,
      height: 65,
    },
    drawerStyle: {
      backgroundColor: isDarkMode ? colors.blackBackground : colors.whiteBackground,
      width: '60%',
    },
  };

  return (
    <Drawer.Navigator
      initialRouteName="Dashboard"
      screenOptions={drawerNavOptions}
      drawerContent={props => <CustomDrawerContent {...props} isDarkMode={isDarkMode} />}
    >
      <Drawer.Screen name="Home" component={BottomHomeTabNavigator} />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%', 
    paddingHorizontal: 10, 
  },
  notificationContainer: {
    position: 'relative', 
    left:'25%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: colors.dangerRed,  // Changed to a color variable for consistency
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationText: {
    color: 'white',
    fontSize: 12,
  },
});

export default DrawerNavigator;
