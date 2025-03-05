import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { setAlert } from './alertSlice';
import setAuthToken from '../utils/setAuthToken';

// Initial state
const initialState = {
  token: localStorage.getItem('token'),
  isAuthenticated: null,
  loading: true,
  user: null,
};

export const loadUser = createAsyncThunk(
  'auth/loadUser',
  async (_, { rejectWithValue }) => {
    try {
      if (localStorage.token) {
        setAuthToken(localStorage.token);
      }
      const res = await axios.get('/api/auth');
      return res.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

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

      // Set token in localStorage here, before returning
      if (res.data && res.data.token) {
        localStorage.setItem('token', res.data.token);
      }
      dispatch(loadUser());

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

// Convert login to createAsyncThunk
export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { dispatch, rejectWithValue }) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const body = JSON.stringify({ email, password });
    try {
      const res = await axios.post('/api/auth', body, config);

      // Set token in localStorage here, before returning
      if (res.data && res.data.token) {
        localStorage.setItem('token', res.data.token);
        setAuthToken(res.data.token);
      }
      dispatch(loadUser());
      return res.data;
    } catch (err) {
      if (err.response && err.response.data) {
        const { data } = err.response;
        if (data.errors) {
          data.errors.forEach((error) => {
            dispatch(setAlert({ msg: error.msg, alertType: 'danger' }));
          });
        }
        return rejectWithValue(data.msg || 'Login failed');
      } else if (err.message) {
        dispatch(setAlert({ msg: err.message, alertType: 'danger' }));
        return rejectWithValue(err.message);
      } else {
        dispatch(setAlert({ msg: 'Login failed', alertType: 'danger' }));
        return rejectWithValue('Login failed');
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
    accountDeleted: (state) => {
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
          // Token is already set in localStorage in the thunk
          state.token = action.payload.token;
          state.isAuthenticated = true;
          state.loading = false;
        }
      })
      .addCase(register.rejected, (state, action) => {
        localStorage.removeItem('token');
        state.token = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.user = null;
      })

      // Login user cases
      .addCase(login.pending, (state) => {
        state.loading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        if (action.payload && action.payload.token) {
          // Token is already set in localStorage in the thunk
          state.token = action.payload.token;
          state.isAuthenticated = true;
          state.loading = false;
        }
      })
      .addCase(login.rejected, (state, action) => {
        localStorage.removeItem('token');
        state.token = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.user = null;
      })

      // Load user cases
      .addCase(loadUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        if (action.payload) {
          state.isAuthenticated = true;
          state.loading = false;
          state.user = action.payload;
        }
      })
      .addCase(loadUser.rejected, (state, action) => {
        localStorage.removeItem('token');
        state.token = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.user = null;
      });
  },
});

export const { logout, accountDeleted } = authSlice.actions;
export default authSlice.reducer;
