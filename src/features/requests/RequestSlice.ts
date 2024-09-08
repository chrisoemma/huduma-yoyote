import AsyncStorage from '@react-native-async-storage/async-storage';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { API_URL } from '../../utils/config';
import * as RootNavigation from './../../navigation/RootNavigation';
import { authHeader } from '../../utils/auth-header';

export const getActiveRequests = createAsyncThunk(
  'requests/getActiveRequests',
  async (id) => {
    //console.log('client_idddd',id);
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


export const updateRequestStatus = createAsyncThunk(
  'requests/updateRequestStatus',
  async ({ data, requestId }: any) => {

    // console.log('dataaa', data)
    // console.log('request_id', requestId);

    const response = await fetch(`${API_URL}/requests/update_status/${requestId}`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return (await response.json());
  });


  export const getRequestLastLocation = createAsyncThunk(
    'requests/getRequestLastLocation',
    async (id) => {
      let header: any = await authHeader();
      const response = await fetch(`${API_URL}/requests/last_location/${id}`, {
        method: 'GET',
        headers: header,
      });
      return (await response.json()) as any;
    },
  );


export const createRequest = createAsyncThunk(
  'requests/createRequest',
  async ({ data }: any) => {
    const response = await fetch(`${API_URL}/requests`, {
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

export const rateRequest = createAsyncThunk(
  'requests/rateRequest',
  async (data) => {

    const response = await fetch(`${API_URL}/requests/rate_request/${data.requestId}`, {
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

function updateStatus(state: any, status: any) {
  if (status === '' || status === null) {
    state.status = '';
    return;
  }

  if (status.error) {
    state.status = status.error;
    return;
  }

  state.status = 'Request failed. Please try again.';
  return;
}


const RequestSlice = createSlice({
  name: 'requests',
  initialState: {
    activeRequests: [],
    activeRequest: {},
    requests: [],
    requestLastLocation:{},
    createRequestLoading:false,
    changeStatusLoading:false,
    rating: {},
    ratings: [],
    request: {},
    pastRequests: [],
    loading: false,
  },
  reducers: {
    clearMessage(state: any) {
      state.status = null;
    },

    setRequestStatus: (state, action) => {
      const updatedRequest = action.payload;
      const requestIndex = state.activeRequests.findIndex(
        (request) => request.id === updatedRequest.id
      );
    
      if (requestIndex !== -1) {
        const newStatus = updatedRequest.statuses[updatedRequest.statuses.length - 1].status;
    
        // Determine if the status is in the list of past statuses
        const isPastStatus = ['Cancelled', 'Rejected', 'Completed'].includes(newStatus);
    
        if (isPastStatus) {
          // Remove from activeRequests and add to pastRequests
          state.activeRequests = [
            ...state.activeRequests.slice(0, requestIndex),
            ...state.activeRequests.slice(requestIndex + 1),
          ];
    
          state.pastRequests = [
            ...state.pastRequests,
            {
              ...updatedRequest,
              statuses: updatedRequest.statuses,
            },
          ];
        } else {
          // Update the request in activeRequests
          state.activeRequests = [
            ...state.activeRequests.slice(0, requestIndex),
            {
              ...state.activeRequests[requestIndex],
              statuses: updatedRequest.statuses,
            },
            ...state.activeRequests.slice(requestIndex + 1),
          ];
        }
      }
    },

  
  },
  extraReducers: builder => {

    //categories
    builder.addCase(getActiveRequests.pending, state => {
      // console.log('Pending');
      state.loading = true;
    });
    builder.addCase(getActiveRequests.fulfilled, (state, action) => {

      if (action.payload && action.payload.status) {
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

      if (action.payload &&  action.payload.status) {
        state.pastRequests = action.payload.data.requests;
      }
      state.loading = false;
    });
    builder.addCase(getPastRequests.rejected, (state, action) => {
      console.log('Rejected');
      console.log(action.error);

      state.loading = false;
    });



    //create 

    builder.addCase(createRequest.pending, state => {
      console.log('Pending');
      state.createRequestLoading = true;
      updateStatus(state, '');
    });
    builder.addCase(createRequest.fulfilled, (state, action) => {

   
      updateStatus(state, '');

   //   console.log('action.payload.data.activeReques', action.payload.data.activeRequest)

      if (action.payload &&  action.payload.status) {
        state.activeRequest = { ...action.payload.data.activeRequest };
        updateStatus(state, action.payload.status);
        state.activeRequests.push(state.activeRequest);
      } else {
        updateStatus(state, '');
      }
      
      state.createRequestLoading = false;
    });
    
    builder.addCase(createRequest.rejected, (state, action) => {
      console.log('Rejected');
      state.createRequestLoading = false;
      updateStatus(state, '');
    });




    ////last locations
    builder.addCase(getRequestLastLocation.pending, state => {
      // console.log('Pending');
       state.loading = true;
     });
     builder.addCase(getRequestLastLocation.fulfilled, (state, action) => {
     // console.log('Fulfilled case');
      // console.log(action.payload);
       if (action.payload &&  action.payload.status) {
         state.requestLastLocation = action.payload.data;
       }
       state.loading = false;
     });
     builder.addCase(getRequestLastLocation.rejected, (state, action) => {
       console.log('Rejected');
       console.log(action.error);

       state.loading = false;
     });



    //update request status


    builder.addCase(updateRequestStatus.pending, (state) => {
      console.log('Update sTATUS Pending');
      state.changeStatusLoading = true;
      updateStatus(state, '');
    });


    builder.addCase(updateRequestStatus.fulfilled, (state, action) => {
     // console.log('payload', action.payload);
    
      if (action.payload && action.payload.status) {
        const updatedRequest = action.payload.data.request;
        const newStatus = updatedRequest.statuses[updatedRequest.statuses.length - 1].status;
        const requestIndex = state.activeRequests.findIndex(
          (request) => request.id === updatedRequest.id
        );
    
        if (requestIndex !== -1) {
          // Determine if the status has changed to a past status
          const isPastStatus = ['Cancelled', 'Rejected', 'Completed'].includes(newStatus);
    
          if (isPastStatus) {
            // Move request from activeRequests to pastRequests
            const requestToMove = {
              ...state.activeRequests[requestIndex], // Preserve all other details
              statuses: updatedRequest.statuses,      // Update statuses only
            };
    
            state.activeRequests = [
              ...state.activeRequests.slice(0, requestIndex),
              ...state.activeRequests.slice(requestIndex + 1),
            ];
    
            state.pastRequests = [
              ...state.pastRequests,
              requestToMove,
            ];
          } else {
            // Update the statuses if it's still an active request
            state.activeRequests[requestIndex] = {
              ...state.activeRequests[requestIndex],
              statuses: updatedRequest.statuses, // Update statuses only
            };
          }
        }
      }
    
      state.changeStatusLoading = false;
      updateStatus(state, '');
    });
    
    

    builder.addCase(updateRequestStatus.rejected, (state, action) => {
      console.log('Rejected');
      state.changeStatusLoading = false;
      updateStatus(state, '');
    });


    builder.addCase(rateRequest.pending, state => {
      state.loading = true;
      updateStatus(state, '');
    });
    
    builder.addCase(rateRequest.fulfilled, (state, action) => {
      if (action.payload && action.payload.status) {
        const updatedRequest = action.payload.data.request;
        const newStatus = updatedRequest.statuses[updatedRequest.statuses.length - 1].status;
        const requestIndex = state.activeRequests.findIndex(
          (request) => request.id === updatedRequest.id
        );
    
        if (requestIndex !== -1) {
          const isPastStatus = ['Cancelled', 'Rejected', 'Completed'].includes(newStatus);
    
          if (isPastStatus) {
            const requestToMove = {
              ...state.activeRequests[requestIndex],
              statuses: updatedRequest.statuses,
              rating: updatedRequest.rating, // Add the rating
            };
    
            // Remove from activeRequests and add to pastRequests
            state.activeRequests = [
              ...state.activeRequests.slice(0, requestIndex),
              ...state.activeRequests.slice(requestIndex + 1),
            ];
    
            state.pastRequests = [
              ...state.pastRequests,
              requestToMove,
            ];
          } else {
            // Update only statuses and rating if still active
            state.activeRequests[requestIndex] = {
              ...state.activeRequests[requestIndex],
              statuses: updatedRequest.statuses,
              rating: updatedRequest.rating, // Update the rating
            };
          }
        }
      }
      state.loading = false;
      updateStatus(state, '');
    });
    
    
    builder.addCase(rateRequest.rejected, (state, action) => {
      state.loading = false;
      updateStatus(state, '');
    });
    

  },
});

export const { clearMessage,setRequestStatus } = RequestSlice.actions;

export default RequestSlice.reducer;