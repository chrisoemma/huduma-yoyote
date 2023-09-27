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

  const ServiceSlice = createSlice({
    name: 'services',
    initialState: {
      services: [],
      loading: false,
    },
    reducers: {
      clearMessage(state: any) {
        state.status = null;
      },
    },
    extraReducers: builder => {
 
      builder.addCase(getServices.pending, state => {
        console.log('Pending');
        state.loading = true;
      });
      builder.addCase(getServices.fulfilled, (state, action) => {
       // console.log('Fulfilled case');
      //  console.log(action.payload);
  
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
    },
  });
  
  export const { clearMessage } = ServiceSlice.actions;
  
  export default ServiceSlice.reducer;