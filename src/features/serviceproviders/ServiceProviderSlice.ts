import AsyncStorage from '@react-native-async-storage/async-storage';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { API_URL } from '../../utils/config';
import * as RootNavigation from './../../navigation/RootNavigation';
import { authHeader } from '../../utils/auth-header';

export const getBestProviders = createAsyncThunk(
    'services/bestProviders',
    async (id) => {
    
      let header: any = await authHeader();
      const response = await fetch(`${API_URL}/providers/best_providers/${id}`, {
        method: 'GET',
        headers: header,
      });
      return (await response.json()) as any;
    },
  );

  export const getNearProviders = createAsyncThunk(
    'services/nearProviders',
    async (id) => {
      let header: any = await authHeader();
      const response = await fetch(`${API_URL}/providers/near_me/${id}`, {
        method: 'GET',
        headers: header,
      });
      return (await response.json()) as any;
    },
  );

  export const getProviderLastLocation = createAsyncThunk(
    'services/getProviderLastLocation',
    async (id) => {
      let header: any = await authHeader();
      const response = await fetch(`${API_URL}/providers/provider_last_location/${id}`, {
        method: 'GET',
        headers: header,
      });
      return (await response.json()) as any;
    },
  );


  export const getProviderSubServices = createAsyncThunk(
    'services/providerServiceInfo',
    async ({providerId,serviceId}) => {
      let header: any = await authHeader();
      const response = await fetch(`${API_URL}/providers/sub_services/${providerId}/${serviceId}`, {
        method: 'GET',
        headers: header,
      });
      return (await response.json()) as any;
    },
  );

  const ServiceProviderSlice = createSlice({
    name: 'providers',
    initialState: {
      bestProviders: [],
      nearProviders:[],
      subServices:[],
      providerLastLocation:{},
      providerSubServices:[],
      loading: false,
    },
    reducers: {
      clearMessage(state: any) {
        state.status = null;
      },
    },
    extraReducers: builder => {
 
      builder.addCase(getBestProviders.pending, state => {
       // console.log('Pending');
        state.loading = true;
      });
      builder.addCase(getBestProviders.fulfilled, (state, action) => {
      // console.log('Fulfilled case');
      //  console.log(action.payload);
  
        if (action.payload.status) {
          state.bestProviders = action.payload.data.best_providers;
        }
        state.loading = false;
      });
      builder.addCase(getBestProviders.rejected, (state, action) => {
        console.log('Rejected');
        console.log(action.error);

        state.loading = false;
      });


      builder.addCase(getProviderLastLocation.pending, state => {
        // console.log('Pending');
         state.loading = true;
       });
       builder.addCase(getProviderLastLocation.fulfilled, (state, action) => {
       // console.log('Fulfilled case');
        // console.log(action.payload);
         if (action.payload.status) {
           state.providerLastLocation = action.payload.data;
         }
         state.loading = false;
       });
       builder.addCase(getProviderLastLocation.rejected, (state, action) => {
         console.log('Rejected');
         console.log(action.error);
 
         state.loading = false;
       });


       builder.addCase(getProviderSubServices.pending, state => {
        // console.log('Pending');
         state.loading = true;
       });
       builder.addCase(getProviderSubServices.fulfilled, (state, action) => {
       // console.log('Fulfilled case');
        // console.log(action.payload);
         if (action.payload.status) {
          state.subServices = action.payload.data.sub_services;
          state.providerSubServices=action.payload.data.provider_sub_services;
         }
         state.loading = false;
       });
       builder.addCase(getProviderSubServices.rejected, (state, action) => {
         console.log('Rejected');
         console.log(action.error);
 
         state.loading = false;
       });
    },
  });
  
  export const { clearMessage } = ServiceProviderSlice.actions;
  
  export default ServiceProviderSlice.reducer;