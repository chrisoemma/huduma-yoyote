import AsyncStorage from '@react-native-async-storage/async-storage';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { API_URL } from '../../utils/config';
import * as RootNavigation from './../../navigation/RootNavigation';
import { authHeader } from '../../utils/auth-header';

export const getServices = createAsyncThunk(
  'services/getServices',
  async () => {
    let header: any = await authHeader();
    const response = await fetch(`${API_URL}/services`, {
      method: 'GET',
      headers: header,
    });
    return (await response.json()) as any;
  },
);

export const getSimilarService = createAsyncThunk(
  'services/getSimilarService',
  async (serviceId) => {
    let header: any = await authHeader();
    const response = await fetch(`${API_URL}/services/similar/${serviceId}`, {
      method: 'GET',
      headers: header,
    });
    return (await response.json()) as any;
  },
);

export const getSingleService = createAsyncThunk(
  'services/getSingleService',
  async (serviceId) => {
    let header: any = await authHeader();
    const response = await fetch(`${API_URL}/services/${serviceId}`, {
      method: 'GET',
      headers: header,
    });
    return (await response.json()) as any;
  },
);


export const getSubserviceByService = createAsyncThunk(
  'subservices/getSubserviceByService',
  async (serviceId) => {

    let header: any = await authHeader();
    const response = await fetch(`${API_URL}/sub_services/sub_services_by_service/${serviceId}`, {
      method: 'GET',
      headers: header,
    });
    return (await response.json()) as any;
  },
);

const ServiceSlice = createSlice({
  name: 'services',
  initialState: {
    services: [],
    service:{},
    similarServices: [],
    subServiceByService: [],
    loading: false,
  },
  reducers: {
    clearMessage(state: any) {
      state.status = null;
    },
    clearSingleService(state) {
      state.service = {};
    },
    clearSimilarServices(state) {
      state.similarServices = [];
    },
    clearSubserviceByService(state) {
      state.subServiceByService = [];
    },
  },
  extraReducers: builder => {

    builder.addCase(getServices.pending, state => {
      console.log('Pending');
      state.loading = true;
    });
    builder.addCase(getServices.fulfilled, (state, action) => {

      if (action.payload.status) {
        state.services = action.payload.data.services;
      }
      state.loading = false;
    });
    builder.addCase(getServices.rejected, (state, action) => {
      console.log('Rejected');
      console.log(action.error);

      state.loading = false;
    });


    //get sililar services
    builder.addCase(getSimilarService.pending, state => {
      state.loading = true;
    });
    builder.addCase(getSimilarService.fulfilled, (state, action) => {

      if (action.payload.status) {
        state.similarServices = action.payload.data.services;
      }
      state.loading = false;
    });
    builder.addCase(getSimilarService.rejected, (state, action) => {
      console.log('Rejected');
      console.log(action.error);

      state.loading = false;
    });


    //getSingle Serice


    builder.addCase(getSingleService.pending, state => {
       state.loading = true;
    });
    builder.addCase(getSingleService.fulfilled, (state, action) => {
         
      if(action.payload.status) {
          state.service = action.payload.data.service;
      }
      state.loading = false;
    });
    builder.addCase(getSingleService.rejected, (state, action) => {
      console.log(action.error);
      state.loading = false;
    });

     
    //get sub services
    //businesses
    builder.addCase(getSubserviceByService.pending, state => {
      // console.log('Pending');
      state.loading = true;
    });
    builder.addCase(getSubserviceByService.fulfilled, (state, action) => {
      if (action.payload.status) {
        state.subServiceByService = action.payload.data.sub_services;
      }
      state.loading = false;
    });
    builder.addCase(getSubserviceByService.rejected, (state, action) => {
      console.log('Rejected');
      console.log(action.error);
      state.loading = false;
    });

  },
});

export const { clearMessage,clearSingleService, clearSimilarServices, clearSubserviceByService  } = ServiceSlice.actions;

export default ServiceSlice.reducer;