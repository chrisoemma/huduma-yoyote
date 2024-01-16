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

  
  const AppStack = () => {
    
    const Stack = createNativeStackNavigator();
    const { t } = useTranslation();

    const screenOptions = {
        headerShown: false,
      };

    return (
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
    );
  };

  export default AppStack