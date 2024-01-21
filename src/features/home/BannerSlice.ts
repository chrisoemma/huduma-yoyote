import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { API_URL } from '../../utils/config';
import { authHeader } from '../../utils/auth-header';

export const getBanners = createAsyncThunk(
    'banners/getBanners',
    async () => {
      let header: any = await authHeader();
      const response = await fetch(`${API_URL}/banners/displayed`, {
        method: 'GET',
        headers: header,
      });
      return (await response.json()) as any;
    },
  );

  const BannerSlice = createSlice({
    name: 'banners',
    initialState: {
      banners: [],
      loading: false,
    },
    reducers: {
      clearMessage(state: any) {
        state.status = null;
      },
    },
    extraReducers: builder => {
 
      builder.addCase(getBanners.pending, state => {
      ///  console.log('Pending');
        state.loading = true;
      });
      builder.addCase(getBanners.fulfilled, (state, action) => {
      
        if (action.payload.status) {
          state.banners = action.payload.data.banners;
        }
        state.loading = false;
      });
      builder.addCase(getBanners.rejected, (state, action) => {
        console.log('Rejected');
        console.log(action.error);

        state.loading = false;
      });
    },
  });
  
  export const { clearMessage } = BannerSlice.actions;
  
  export default BannerSlice.reducer;