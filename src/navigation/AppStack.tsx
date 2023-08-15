import { createNativeStackNavigator } from "@react-navigation/native-stack";
import DrawerNavigator from "./DrawerNavigator";
import CategoryScreen from "../features/category/CategoryScreen";
import SingleCategory from "../features/category/SingleCategory";

  
  const AppStack = () => {
    
    const Stack = createNativeStackNavigator();
    const screenOptions = {
        headerShown: false,
      };

    return (
      <Stack.Navigator initialRouteName="Home" >
        <Stack.Screen name="Home" component={DrawerNavigator} 
         options={{ headerShown: false }}
        />
        <Stack.Screen name="Categories" component={CategoryScreen} />
        <Stack.Screen name="Single category" component={SingleCategory} />
      </Stack.Navigator>
    );
  };

  export default AppStack