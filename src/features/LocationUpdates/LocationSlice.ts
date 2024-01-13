import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { API_URL } from '../../utils/config';
import { authHeader } from '../../utils/auth-header';

export const postClientLocation = createAsyncThunk(
    'locations/postClientLocation',
    async ({clientId, data}: any) => {
        const response = await fetch(`${API_URL}/clients/location_update/${clientId}`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        return (await response.json());
    },
  );


  const LocationSlice = createSlice({
    name: 'locations',
    initialState: {
      clientLocation:{},
      poviderLocations:{},
      loading: false,
    },
    reducers: {
      clearMessage(state: any) {
        state.status = null;
      },
    },
    extraReducers: builder => {
       
      builder.addCase(postClientLocation.pending, state => {
        state.loading = true;
      });
      builder.addCase(postClientLocation.fulfilled, (state, action) => {
  
        if (action.payload.status) {
          state.clientLocation = action.payload.data.client_location;
        }
        state.loading = false;
      });
      builder.addCase(postClientLocation.rejected, (state, action) => {
        console.log('Rejected');
        console.log(action.error);
        state.loading = false;
      });
    },
  });
  
  export const { clearMessage } = LocationSlice.actions;
  
  export default LocationSlice.reducer;