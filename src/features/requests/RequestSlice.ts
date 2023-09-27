import AsyncStorage from '@react-native-async-storage/async-storage';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { API_URL } from '../../utils/config';
import * as RootNavigation from './../../navigation/RootNavigation';
import { authHeader } from '../../utils/auth-header';

export const getActiveRequests = createAsyncThunk(
    'requests/getActiveRequests',
    async (id) => {
     
      let header: any = await authHeader();
      const response = await fetch(`${API_URL}/requests/on_progress/client/${id}`, {
        method: 'GET',
        headers: header,
      });
      return (await response.json()) as any;
    },
  );

  export const getPastRequests = createAsyncThunk(
    'requests/getPastRequests',
    async (id) => {
      let header: any = await authHeader();
      const response = await fetch(`${API_URL}/requests/past/client/${id}`, {
        method: 'GET',
        headers: header,
      });
      return (await response.json()) as any;
    },
  );


  const RequestSlice = createSlice({
    name: 'requests',
    initialState: {
      activeRequests: [],
      pastRequests:[],
      loading: false,
    },
    reducers: {
      clearMessage(state: any) {
        state.status = null;
      },
    },
    extraReducers: builder => {
       
        //categories
      builder.addCase(getActiveRequests.pending, state => {
       // console.log('Pending');
        state.loading = true;
      });
      builder.addCase(getActiveRequests.fulfilled, (state, action) => {
  
        if (action.payload.status) {
          state.activeRequests = action.payload.data.requests;
        }
        state.loading = false;
      });
      builder.addCase(getActiveRequests.rejected, (state, action) => {
        console.log('Rejected');
        console.log(action.error);

        state.loading = false;
      });

      builder.addCase(getPastRequests.pending, state => {
        // console.log('Pending');
         state.loading = true;
       });
       builder.addCase(getPastRequests.fulfilled, (state, action) => {
   
         if (action.payload.status) {
           state.pastRequests = action.payload.data.requests;
         }
         state.loading = false;
       });
       builder.addCase(getPastRequests.rejected, (state, action) => {
         console.log('Rejected');
         console.log(action.error);
 
         state.loading = false;
       });

    },
  });
  
  export const { clearMessage } = RequestSlice.actions;
  
  export default RequestSlice.reducer;