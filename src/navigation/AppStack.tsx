import { createNativeStackNavigator } from "@react-navigation/native-stack";
import DrawerNavigator from "./DrawerNavigator";
import CategoryScreen from "../features/category/CategoryScreen";
import SingleCategory from "../features/category/SingleCategory";
import ServiceScreen from "../features/Service/ServiceScreen";
import SingleService from "../features/Service/SingleService";
import ServiceProviders from "../features/serviceproviders/ServiceProviders";
import ServiceRequest from "../features/Service/ServiceRequest";
import RequestedServices from "../features/Service/RequestedServices";
import Settings from "../features/settings/Settings";
import { useTranslation } from "react-i18next";
import EditAccount from "../features/account/EditAccount";
import ChangePassword from "../features/auth/ChangePassword";
import SearchScreen from "../features/home/SearchScreen";
import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { useAppDispatch } from "../app/store";
import { postUserDeviceToken, postUserOnlineStatus} from "../features/auth/userSlice";
import { AppState } from "react-native";
import messaging from '@react-native-firebase/messaging';
import FCMMessageHandler from "../components/FCMMessageHandler";
;

  
  const AppStack = () => {
    
    const Stack = createNativeStackNavigator();
    const { t } = useTranslation();
    const dispatch = useAppDispatch();

    const screenOptions = {
        headerShown: false,
      };

      const { user} = useSelector((state: RootStateOrAny) => state.user);
      const appState = useRef(AppState.currentState);
      const [appStateVisible, setAppStateVisible] = useState(appState.current);


      useEffect(() => {
        const requestPermission = async () => {
          try {
            await messaging().requestPermission();
            retrieveDeviceToken();
          } catch (error) {
            console.log('Permission denied:', error);
          }
        };
        const retrieveDeviceToken = async () => {
       
          try {           
            const token = await messaging().getToken();
            console.log('Device Token:', token);
        
            dispatch(postUserDeviceToken({userId:user?.id,deviceToken:token}))
          } catch (error) {
            console.log('Error retrieving device token:', error);
          }
        };
        requestPermission();
      }, []);
      
      useEffect(() => {
        let data={
          isOnline:false
        }
        const handleAppStateChange = (nextAppState) => {
        
          appState.current = nextAppState;
          setAppStateVisible(appState.current);
          console.log('AppState', appState.current);
          if (appState.current === 'active') {
            console.log('App has come to the foreground!');
            if (user) {
                 data.isOnline=true
              dispatch(postUserOnlineStatus({ userId: user?.id, data }));
            
            }
          }
          if (appState.current === 'background') {
            console.log('App has gone to the background!');
            if (user) {
              data.isOnline=false
              dispatch(postUserOnlineStatus({ userId: user?.id, data }));
            
            }
          }
        };
    
        const appStateSubscription = AppState.addEventListener('change', handleAppStateChange);
    
        return () => {
          appStateSubscription.remove();
        };
      }, [dispatch]);

    return (
      <>
      
      <FCMMessageHandler />
      <Stack.Navigator initialRouteName="Home" >
        <Stack.Screen name="Home" component={DrawerNavigator} 
         options={{ headerShown: false }}
        />

        <Stack.Screen name="Search" 
        component={SearchScreen}
        options={{ title: t('navigate:search'),headerShown: false }}
         />

        <Stack.Screen name="Categories" 
        component={CategoryScreen}
        options={{ title: t('navigate:categories') }}
         />
        <Stack.Screen name="Single category"
         component={SingleCategory}
         options={{ title: t('navigate:singleCategory') }}
          />
        <Stack.Screen name="Services"
         component={ServiceScreen}
         options={{ title: t('navigate:service') }}
          />
       <Stack.Screen name="Change Password"
         component={ChangePassword}
         options={{ title: t('screens:changePassword') }}
          />

         <Stack.Screen name="Edit Account"
         component={EditAccount}
         options={{ title: t('navigate:editAccount') }}
          />

        <Stack.Screen name="Single service"
         component={SingleService} 
         options={{ title: t('navigate:singleService') }}
         />
        <Stack.Screen name="Service providers" 
        component={ServiceProviders}
        options={{ title: t('navigate:serviceProvider') }}
         />
        <Stack.Screen name="Service request"
         component={ServiceRequest} 
         options={{ title: t('navigate:serviceRequest') }}
         
         />
        <Stack.Screen name="Requested services" 
        component={RequestedServices} 
        options={{ title: t('navigate:requestedServices') }}
        
        />
        <Stack.Screen
         name="Settings" 
        component={Settings} 
        options={{ title: t('navigate:settings') }}
        />
      </Stack.Navigator>
      </>
    );
  };

  export default AppStack