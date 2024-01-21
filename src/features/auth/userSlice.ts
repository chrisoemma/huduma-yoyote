import AsyncStorage from '@react-native-async-storage/async-storage';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { API_URL } from '../../utils/config';

interface User {
  id: number;
  phone: string;
  name: string;

}

interface UserData {
  status: boolean;
  user: User;
  token: string;
}

interface UserLoginDTO {
  phone: string;
  password: string;
}

interface UserRegisterDTO {
  name: string;
  phone: string;
  password: string;
  app_type: string;
  email:string;
}

interface PhoneVerificationDTO {
  user_id: string;
  code: string;
}

interface ForgotPasswordDTO {
  phone: string;
}

interface ResetPasswordDTO {
  phone: string;
  code: string;
  password: string;
}

export const userLogin = createAsyncThunk(
  'users/userLogin',
  async (data: UserLoginDTO) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return (await response.json()) as UserData;
  },
);


export const changePassword = createAsyncThunk(
  'users/changePassword',
  async ({ data, userId }: any) => {
    const response = await fetch(`${API_URL}/auth/change_password/${userId}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return (await response.json()) as UserData;
  },
);

export const updateProfile = createAsyncThunk(
  'users/updateProfile',
  async ({ data, userId }: any) => {
    
    try {
      console.log('user', userId);
      const response = await fetch(`${API_URL}/users/change_profile_picture/${userId}`, {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Request failed');
      }

      return await response.json();
    } catch (error) {
      // Handle the error gracefully, e.g., log the error and return an appropriate response
      console.error('Error in updateProviderInfo:', error);
      throw error; // Rethrow the error to be caught by Redux Toolkit
    }
  }
);


export const updateUserInfo = createAsyncThunk(
  'users/updateUserInfo',
  async ({ data, userType,userId }: any) => {
    try {
      console.log('userId', userId);
      console.log('user info',userType)
      console.log('dataa',data)
      const response = await fetch(`${API_URL}/users/update_account/${userType}/${userId}`, {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        
        const errorData = await response.json();
        throw new Error(`Request failed: ${errorData.message}`);
      }

      return await response.json();
    } catch (error) {
      // Handle the error gracefully, e.g., log the error and return an appropriate response
      console.error('Error in updateProviderInfo:', error);
      throw error; // Rethrow the error to be caught by Redux Toolkit
    }
  }
);

export const userRegiter = createAsyncThunk(
  'users/userRegister',
  async (data: UserRegisterDTO) => {
    console.log('data from useregister', data)
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return (await response.json()) as UserData;
  },
);

export const userVerify = createAsyncThunk(
  'users/userVerify',
  async (data: PhoneVerificationDTO) => {
    const response = await fetch(`${API_URL}/auth/verify-phone`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return (await response.json()) as UserData;
  },
);

export const forgotPassword = createAsyncThunk(
  'users/forgotPassword',
  async (data: ForgotPasswordDTO) => {
    const response = await fetch(`${API_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return (await response.json()) as any;
  },
);

export const resetPassword = createAsyncThunk(
  'users/resetPassword',
  async (data: ResetPasswordDTO) => {
    const response = await fetch(`${API_URL}/auth/reset-password`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return (await response.json()) as UserData;
  },
);

function logout(state: any) {
  console.log('::: USER LOGOUT CALLED :::');
  state.user = {};
}

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

const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: {} as UserData,
    config: {},
    isFirstTimeUser:true,
    loading: false,
    status: '',
  },
  reducers: {
    userLogout(state: any) {
      logout(state);
    },
    clearMessage(state: any) {
      state.status = null;
    },

    setFirstTime: (state, action) => {
      state.isFirstTimeUser = action.payload;
    },
  },
  extraReducers: builder => {
    //LOGIN
    builder.addCase(userLogin.pending, state => {
      console.log('Pending');
      updateStatus(state, '');
      state.loading = true;
    });
    builder.addCase(userLogin.fulfilled, (state, action) => {
      console.log('Fulfilled case');
      console.log(action.payload);

      if (action.payload.status) {
        state.user = action.payload.user as any;
        state.user.token = action.payload.token;
        state.config = action.payload.config;
        AsyncStorage.setItem('token', action.payload.token);
        updateStatus(state, '');
      } else {
        updateStatus(state, action.payload);
      }

      state.loading = false;
    });
    builder.addCase(userLogin.rejected, (state, action) => {
      console.log('Rejected');
      console.log(action.error);
      updateStatus(state, 'Something went wrong, please try again later');
      state.loading = false;
    });

    //REGISTER
    builder.addCase(userRegiter.pending, state => {
      console.log('Pending');
      state.loading = true;
      updateStatus(state, '');
    });
    builder.addCase(userRegiter.fulfilled, (state, action) => {
      console.log('Fulfilled case122');
      console.log('Action payload data', action.payload);

      state.loading = false;
      updateStatus(state, '');

      if (action.payload.status) {
        state.user = action.payload.user as any;
        state.config = action.payload.config;
        updateStatus(state, '');
      } else {
        updateStatus(state, action.payload);
      }
    });
    builder.addCase(userRegiter.rejected, (state, action) => {
      console.log('Rejected');
      console.log(action.error);
      state.loading = false;
      updateStatus(state, '');
    });

    //VERIFY
    builder.addCase(userVerify.pending, state => {
      console.log('Pending');
      state.loading = true;
      updateStatus(state, '');
    });
    builder.addCase(userVerify.fulfilled, (state, action) => {
      console.log('Fulfilled case');
      console.log(action.payload);

      state.loading = false;
      updateStatus(state, '');

      if (action.payload.status && action.payload.token) {
        state.user.token = action.payload.token as any;
        updateStatus(state, '');
      } else {
        updateStatus(state, action.payload);
      }
    });
    builder.addCase(userVerify.rejected, (state, action) => {
      console.log('Rejected');
      console.log(action.error);
      state.loading = false;
      updateStatus(state, '');
    });

    //FORGOT PASSWORD
    builder.addCase(forgotPassword.pending, state => {
      console.log('Pending');
      state.loading = true;
      updateStatus(state, '');
    });
    builder.addCase(forgotPassword.fulfilled, (state, action) => {
      console.log('Fulfilled case');
      console.log(action.payload);

      state.loading = false;
      updateStatus(state, '');

      if (action.payload.status) {
        state.user = action.payload.user;
        updateStatus(state, '');
      } else {
        updateStatus(state, action.payload);
      }
    });
    builder.addCase(forgotPassword.rejected, (state, action) => {
      console.log('Rejected');
      console.log(action.error);
      state.loading = false;
      updateStatus(state, '');
    });

    //RESET PASSWORD
    builder.addCase(resetPassword.pending, state => {
      console.log('Pending');
      state.loading = true;
      updateStatus(state, '');
    });
    builder.addCase(resetPassword.fulfilled, (state, action) => {
      console.log('Fulfilled case');
      console.log(action.payload);

      state.loading = false;
      updateStatus(state, '');

      if (action.payload.status) {
        state.user.token = action.payload.token as any;
        updateStatus(state, '');
      } else {
        updateStatus(state, action.payload);
      }
    });
    builder.addCase(resetPassword.rejected, (state, action) => {
      console.log('Rejected');
      console.log(action.error);
      state.loading = false;
      updateStatus(state, '');
    });


    builder.addCase(updateProfile.pending, (state) => {
      console.log('Update Provider Pending');
      state.loading = true;
      updateStatus(state, '');
    });

    builder.addCase(updateProfile.fulfilled, (state, action) => {
      console.log('Update Task Fulfilled');
      console.log('dataaa1234', action.payload.data)

      state.user = {
        ...state.user,
        ...action.payload.data.user,
      };

      // Update token if it's received in the response
      if (action.payload.data.token) {
        state.user.token = action.payload.data.token;
      }

      state.loading = false;
      updateStatus(state, '');
    });
    builder.addCase(updateProfile.rejected, (state, action) => {
      console.log('Rejected');
      state.loading = false;
      updateStatus(state, '');
    });


    builder.addCase(updateUserInfo.pending, (state) => {
      
      state.loading = true;
      updateStatus(state, '');
    });
    builder.addCase(updateUserInfo.fulfilled, (state, action) => {
      console.log('Update Task Fulfilled');
      console.log('dataaa1234', action.payload.data)

      state.user = {
        ...state.user,
        ...action.payload.data.user,
      };

      // Update token if it's received in the response
      if (action.payload.data.token) {
        state.user.token = action.payload.data.token;
      }

      state.loading = false;
      updateStatus(state, '');
    });
    builder.addCase(updateUserInfo.rejected, (state, action) => {
      console.log('Rejected');
      state.loading = false;
      updateStatus(state, '');
    });



       //Change password

    builder.addCase(changePassword.pending, state => {
      console.log('Pending');
      state.loading = true;
      updateStatus(state, '');
    });
    builder.addCase(changePassword.fulfilled, (state, action) => {
      console.log('Fulfilled case');
      console.log(action.payload);

      state.loading = false;
      updateStatus(state, '');

      if (action.payload.status) {
        state.user.token = action.payload.token as any;
        updateStatus(state, '');
      } else {
        updateStatus(state, action.payload);
      }
    });
    builder.addCase(changePassword.rejected, (state, action) => {
      console.log('Rejected');
      console.log(action.error);
      state.loading = false;
      updateStatus(state, '');
    });
  },
});

export const { userLogout, clearMessage,setFirstTime } = userSlice.actions;

export default userSlice.reducer;
