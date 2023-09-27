import AsyncStorage from '@react-native-async-storage/async-storage';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { API_URL } from '../../utils/config';
import * as RootNavigation from './../../navigation/RootNavigation';
import { authHeader } from '../../utils/auth-header';

export const getCategories = createAsyncThunk(
    'categories/getCategories',
    async () => {
      let header: any = await authHeader();
      const response = await fetch(`${API_URL}/categories`, {
        method: 'GET',
        headers: header,
      });
      return (await response.json()) as any;
    },
  );

  export const getCategoryServices = createAsyncThunk(
    'categories/getCategoryServices',
    async () => {
      let header: any = await authHeader();
      const response = await fetch(`${API_URL}/categories/category_services`, {
        method: 'GET',
        headers: header,
      });
      return (await response.json()) as any;
    },
  );

  export const getSingleCategory = createAsyncThunk(
    'categories/getSingleCategory',
    async (id) => {
        console.log('idddssss',id);
      let header: any = await authHeader();
      const response = await fetch(`${API_URL}/categories/${id}`, {
        method: 'GET',
        headers: header,
      });
      return (await response.json()) as any;
    },
  );

  const CategorySlice = createSlice({
    name: 'categories',
    initialState: {
      categories: [],
      category_services:[],
      singleCategory:[],
      loading: false,
    },
    reducers: {
      clearMessage(state: any) {
        state.status = null;
      },
    },
    extraReducers: builder => {
       
        //categories
      builder.addCase(getCategories.pending, state => {
       // console.log('Pending');
        state.loading = true;
      });
      builder.addCase(getCategories.fulfilled, (state, action) => {
       // console.log('Fulfilled case');
       // console.log(action.payload);
  
        if (action.payload.status) {
          state.categories = action.payload.data.categories;
        }
        state.loading = false;
      });
      builder.addCase(getCategories.rejected, (state, action) => {
        console.log('Rejected');
        console.log(action.error);

        state.loading = false;
      });


      //category_services

      builder.addCase(getCategoryServices.pending, state => {
        console.log('Pending');
        state.loading = true;
      });
      builder.addCase(getCategoryServices.fulfilled, (state, action) => {
        console.log('Fulfilled case');
        console.log(action.payload);
  
        if (action.payload.status) {
          state.category_services = action.payload.data.categories;
        }
        state.loading = false;
      });
      builder.addCase(getCategoryServices.rejected, (state, action) => {
        console.log('Rejected');
        console.log(action.error);

        state.loading = false;
      });

      //SingleCategory

      builder.addCase(getSingleCategory.pending, state => {
        console.log('Pending');
        state.loading = true;
      });
      builder.addCase(getSingleCategory.fulfilled, (state, action) => {
        console.log('Fulfilled case');
        console.log(action.payload);
  
        if (action.payload.status) {
          state.singleCategory = action.payload.data.category;
        }
        state.loading = false;
      });

      builder.addCase(getSingleCategory.rejected, (state, action) => {
        console.log('Rejected');
        console.log(action.error);
        state.loading = false;
      });
      
    },
  });
  
  export const { clearMessage } = CategorySlice.actions;
  
  export default CategorySlice.reducer;