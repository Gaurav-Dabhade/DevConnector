import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { setAlert } from './alertSlice';

// Initial state
const initialState = {
  token: localStorage.getItem('token') || null,
  isAuthenticated: null,
  loading: false,
  user: null,
};

// Create async thunk for registration
export const register = createAsyncThunk(
  'auth/register',
  async ({ name, email, password }, { dispatch, rejectWithValue }) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const body = JSON.stringify({ name, email, password });

    try {
      const res = await axios.post('/api/users', body, config);
      return res.data;
    } catch (err) {
      if (err.response && err.response.data) {
        const { data } = err.response;
        if (data.errors) {
          data.errors.forEach((error) => {
            dispatch(setAlert({ msg: error.msg, alertType: 'danger' }));
          });
        }
        return rejectWithValue(data.msg || 'Registration failed');
      } else if (err.message) {
        dispatch(setAlert({ msg: err.message, alertType: 'danger' }));
        return rejectWithValue(err.message);
      } else {
        dispatch(setAlert({ msg: 'Registration failed', alertType: 'danger' }));
        return rejectWithValue('Registration failed');
      }
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem('token');
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register user cases
      .addCase(register.pending, (state) => {
        state.loading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        if (action.payload && action.payload.token) {
          localStorage.setItem('token', action.payload.token);
          state.token = action.payload.token;
          state.isAuthenticated = true;
          state.loading = false;
          state.user = action.payload.user;
        }
      })
      .addCase(register.rejected, (state, action) => {
        localStorage.removeItem('token');
        state.token = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.user = null;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
