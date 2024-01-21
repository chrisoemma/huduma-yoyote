import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { API_URL } from '../../utils/config';
import { authHeader } from '../../utils/auth-header';

  export const getSearches = createAsyncThunk(
    'search/getSearches',
    async ({ data }: any) => {
      
      try {
        console.log('user', data);
        const response = await fetch(`${API_URL}/searches/search_app`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        return (await response.json()) as any;
      } catch (error) {
        // Handle the error gracefully, e.g., log the error and return an appropriate response
        console.error('Error :', error);
        throw error; // Rethrow the error to be caught by Redux Toolkit
      }
    }
  );


  
  const SearchSlice = createSlice({
    name: 'searches',
    initialState: {
      searchData: [],
      recent:[],
      loading: false,
    },
    reducers: {
      clearMessage(state: any) {
        state.status = null;
      },
      clearSearches(state: any) {
        state.searchData = [];
      },

      addRecentSearch(state: any, action: PayloadAction<any>) {
        const recent = action.payload;
        state.recent.unshift(recent);
        
        // Limit the recent searches to a certain number if needed
        if (state.recent.length > 10) {
          state.recent.pop();
        }
      },

      removeRecentSearch(state, action) {
        const itemIdToRemove = action.payload;
        state.recent = state.recent.filter(search => search.id !== itemIdToRemove);
      },
    

    },
    extraReducers: builder => {
 
      builder.addCase(getSearches.pending, state => {
        console.log('Pending');
        state.loading = true;
      });
      builder.addCase(getSearches.fulfilled, (state, action) => {

        if (action.payload.status) {
          state.searchData = action.payload.data;
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
  
  export const { clearMessage,clearSearches,addRecentSearch,removeRecentSearch } = SearchSlice.actions;
  
  export default SearchSlice.reducer;