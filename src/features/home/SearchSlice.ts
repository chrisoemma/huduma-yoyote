import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { API_URL } from '../../utils/config';
import { authHeader } from '../../utils/auth-header';

export const getSearches = createAsyncThunk(
    'search/getSearches',
    async (data) => {
      let header: any = await authHeader();
      const response = await fetch(`${API_URL}/searches/app_search`, {
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

  const SearchSlice = createSlice({
    name: 'searches',
    initialState: {
      searches: [],
      recentSearches:[],
      loading: false,
    },
    reducers: {
      clearMessage(state: any) {
        state.status = null;
      },

    },
    extraReducers: builder => {
 
      builder.addCase(getSearches.pending, state => {
        console.log('Pending');
        state.loading = true;
      });
      builder.addCase(getSearches.fulfilled, (state, action) => {

        if (action.payload.status) {
          state.searches = action.payload.data;
        }
        state.loading = false;
      });
      builder.addCase(getSearches.rejected, (state, action) => {
        console.log('Rejected');
        console.log(action.error);

        state.loading = false;
      });
    },
  });
  
  export const { clearMessage } = SearchSlice.actions;
  
  export default SearchSlice.reducer;