import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { API_URL } from '../../utils/config';
import { authHeader } from '../../utils/auth-header';

export const getBelowRating = createAsyncThunk(
    'feedbackTemplate/getBelowRating',
    async () => {
      let header: any = await authHeader();
      const response = await fetch(`${API_URL}/feedback_templates/client_below_rating_complete`, {
        method: 'GET',
        headers: header,
      });
      return (await response.json()) as any;
    },
  );


  export const getAboveRating = createAsyncThunk(
    'feedbackTemplate/getAboveRating',
    async () => {
      let header: any = await authHeader();
      const response = await fetch(`${API_URL}/feedback_templates/client_above_rating_complete`, {
        method: 'GET',
        headers: header,
      });
      return (await response.json()) as any;
    },
  );

  export const getCancelTemplate = createAsyncThunk(
    'feedbackTemplate/getCancelTemplate',
    async () => {
      let header: any = await authHeader();
      const response = await fetch(`${API_URL}/feedback_templates/client_cancel`, {
        method: 'GET',
        headers: header,
      });
      return (await response.json()) as any;
    },
  );

  const FeedbackTemplateSlice = createSlice({
    name: 'feedbackTemplate',
    initialState: {
      belowTemplate: [],
      aboveTemplate:[],
      cancelTemplate:[],
      loading: false,
    },
    reducers: {
      clearMessage(state: any) {
        state.status = null;
      },
    },
    extraReducers: builder => {

      builder.addCase(getBelowRating.pending, state => {
        state.loading = true;
      });
      builder.addCase(getBelowRating.fulfilled, (state, action) => {
       // console.log('below12345',action.payload.data);
        if (action.payload.status) {
          state.belowTemplate = action.payload.data.client_template_below;
        }
        state.loading = false;
      });
      builder.addCase(getBelowRating.rejected, (state, action) => {
        console.log('Rejected');
        console.log(action.error);
        state.loading = false;
      });

      //
      builder.addCase(getAboveRating.pending, state => {
        state.loading = true;
      });
      builder.addCase(getAboveRating.fulfilled, (state, action) => {
        if (action.payload.status) {
          state.aboveTemplate = action.payload.data.client_template_above;
        }
        state.loading = false;
      });
      builder.addCase(getAboveRating.rejected, (state, action) => {
        console.log(action.error);
        state.loading = false;
      });

      //Cancel Template
      builder.addCase(getCancelTemplate.pending, state => {
        state.loading = true;
      });
      builder.addCase(getCancelTemplate.fulfilled, (state, action) => {
        if (action.payload.status) {
          state.cancelTemplate = action.payload.data.cancel_template;
        }
        state.loading = false;
      });
      builder.addCase(getCancelTemplate.rejected, (state, action) => {
        console.log('Rejected');
        console.log(action.error);
        state.loading = false;
      });
    },
  });
  
  export const { clearMessage } = FeedbackTemplateSlice.actions;
  
  export default FeedbackTemplateSlice.reducer;