import 'react-native-gesture-handler'
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';
import './src/costants/IMLocalize';

import Navigation from './src/navigation';
import { navigationRef } from './src/navigation/RootNavigation';
import store from './src/app/store';


let persistor = persistStore(store);

const App = () => {
  // React.useEffect(() => {
  //   SplashScreen.hide();
  // });

  return (
   
    <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <NavigationContainer ref={navigationRef}>
     
        <Navigation />
      </NavigationContainer>
    </PersistGate>
  </Provider>
     
  
  );
};

export default App;
