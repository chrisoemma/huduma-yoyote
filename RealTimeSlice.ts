import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { API_URL } from './src/utils/config';


export const postUserDeviceToken = createAsyncThunk(
    'realTime/postUserDeviceToken',
    async ({data}: any) => {
        const response = await fetch(`${API_URL}/users/device_token`, {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        return (await response.json());
    },
  );


  const realTimeSlice = createSlice({
    name: 'realTime',
    initialState: {
      deveiceToken:{},
      loading: false,
    },
    reducers: {
      clearMessage(state: any) {
        state.status = null;
      },
    },
    extraReducers: builder => {
       
      builder.addCase(postUserDeviceToken.pending, state => {
        state.loading = true;
      });
      builder.addCase(postUserDeviceToken.fulfilled, (state, action) => {
  
        if (action.payload.status) {
          state.deveiceToken = action.payload.data.token;
        }
        state.loading = false;
      });
      builder.addCase(postUserDeviceToken.rejected, (state, action) => {
        console.log('Rejected');
        console.log(action.error);
        state.loading = false;
      });

      
    },
  });
  
  export const { clearMessage } = realTimeSlice.actions;
  
  export default realTimeSlice.reducer;