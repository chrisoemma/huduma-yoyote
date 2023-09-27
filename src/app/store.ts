import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { useDispatch } from 'react-redux';
import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

import userReducer from '../features/auth/userSlice';
import CategorySlice from '../features/category/CategorySlice';
import ServiceSlice from '../features/Service/ServiceSlice';
import RequestSlice from '../features/requests/RequestSlice';
import ClientSlice from '../features/account/ClientSlice';
import ServiceProviderSlice from '../features/serviceproviders/ServiceProviderSlice';




const reducers = combineReducers({
  user: userReducer,
  categories:CategorySlice,
  services:ServiceSlice,
  requests:RequestSlice,
  client:ClientSlice,
  providers:ServiceProviderSlice
});

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
};

const persistedReducer = persistReducer(persistConfig, reducers);

const store = configureStore({

  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();

export default store;
