import AsyncStorage from '@react-native-async-storage/async-storage';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { API_URL } from '../../utils/config';
import * as RootNavigation from './../../navigation/RootNavigation';
import { authHeader } from '../../utils/auth-header';

export const getClient = createAsyncThunk(
    'requests/getClient',
    async (userId) => {
      let header: any = await authHeader();
      const response = await fetch(`${API_URL}/users/client/${userId}`, {
        method: 'GET',
        headers: header,
      });
      return (await response.json()) as any;
    },
  );


  const ClientSlice = createSlice({
    name: 'client',
    initialState: {
      client:{},
      loading: false,
    },
    reducers: {
      clearMessage(state: any) {
        state.status = null;
      },
    },
    extraReducers: builder => {
       
        //categories
      builder.addCase(getClient.pending, state => {
       // console.log('Pending');
        state.loading = true;
      });
      builder.addCase(getClient.fulfilled, (state, action) => {
  
        if (action.payload.status) {
          state.client = action.payload.data.client;
        }
        state.loading = false;
      });
      builder.addCase(getClient.rejected, (state, action) => {
        console.log('Rejected');
        console.log(action.error);
        state.loading = false;
      });
    },
  });
  
  export const { clearMessage } = ClientSlice.actions;
  
  export default ClientSlice.reducer;