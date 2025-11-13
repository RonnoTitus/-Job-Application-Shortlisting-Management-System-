import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  createdAt: string;
}
interface UserAuthState {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
const initialState: UserAuthState = {
  user: null,
  token: localStorage.getItem('user_token'),
  isAuthenticated: Boolean(localStorage.getItem('user_token')),
  isLoading: false,
  error: null
};
// Mock API calls - would be replaced with actual API calls in production
export const registerUser = createAsyncThunk('userAuth/registerUser', async (userData: {
  fullName: string;
  email: string;
  phone: string;
  password: string;
}) => {
  // Simulate API call
  return new Promise<{
    user: UserProfile;
    token: string;
  }>((resolve, reject) => {
    setTimeout(() => {
      // Check if email already exists
      if (userData.email === 'existing@example.com') {
        reject(new Error('Email already registered'));
        return;
      }
      resolve({
        user: {
          id: `user_${Date.now()}`,
          fullName: userData.fullName,
          email: userData.email,
          phone: userData.phone,
          createdAt: new Date().toISOString()
        },
        token: 'mock-user-jwt-token'
      });
    }, 800);
  });
});
export const loginUser = createAsyncThunk('userAuth/loginUser', async (credentials: {
  email: string;
  password: string;
}) => {
  // Simulate API call
  return new Promise<{
    user: UserProfile;
    token: string;
  }>((resolve, reject) => {
    setTimeout(() => {
      // Mock successful login
      if (credentials.email === 'user@example.com' && credentials.password === 'password123') {
        resolve({
          user: {
            id: 'user_1',
            fullName: 'linda Applicant',
            email: credentials.email,
            phone: '+256701234567',
            createdAt: '2023-01-01T00:00:00.000Z'
          },
          token: 'mock-user-jwt-token'
        });
      } else {
        reject(new Error('Invalid email or password'));
      }
    }, 800);
  });
});
const userAuthSlice = createSlice({
  name: 'userAuth',
  initialState,
  reducers: {
    userLoginStart: state => {
      state.isLoading = true;
      state.error = null;
    },
    userLoginSuccess: (state, action: PayloadAction<{
      user: UserProfile;
      token: string;
    }>) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem('user_token', action.payload.token);
    },
    userLoginFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    userLogout: state => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      localStorage.removeItem('user_token');
    }
  },
  extraReducers: builder => {
    builder
    // Register user cases
    .addCase(registerUser.pending, state => {
      state.isLoading = true;
      state.error = null;
    }).addCase(registerUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem('user_token', action.payload.token);
    }).addCase(registerUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || 'Registration failed';
    })
    // Login user cases
    .addCase(loginUser.pending, state => {
      state.isLoading = true;
      state.error = null;
    }).addCase(loginUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem('user_token', action.payload.token);
    }).addCase(loginUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || 'Login failed';
    });
  }
});
export const {
  userLoginStart,
  userLoginSuccess,
  userLoginFailure,
  userLogout
} = userAuthSlice.actions;
export default userAuthSlice.reducer;