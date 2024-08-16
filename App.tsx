import 'react-native-gesture-handler'
import React, { useState } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';
import Navigation from './src/navigation';
import store from './src/app/store';
import { MenuProvider } from 'react-native-popup-menu'; 
import { RootSiblingParent } from 'react-native-root-siblings';



let persistor = persistStore(store);

const App = () => {


  return (
    
    <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
    <RootSiblingParent>
       <MenuProvider>
        <Navigation />
       </MenuProvider>
      </RootSiblingParent>
    </PersistGate>
  </Provider>
     
  
  );
};

export default App;
