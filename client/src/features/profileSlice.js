import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { setAlert } from './alertSlice';

// Initial state
const initialState = {
  profile: null,
  profiles: [],
  loading: true,
  repos: [],
  error: {},
};

export const getCurrentProfile = createAsyncThunk(
  'profile/getCurrentProfile',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`/api/profile/me`);
      return res.data;
    } catch (err) {
      return rejectWithValue({
        msg: err.response.statusText,
        status: err.response.status,
      });
    }
  }
);

export const createProfile = createAsyncThunk(
  'profile/createProfile',
  async (
    { formData, navigate, edit = false },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const body = JSON.stringify(formData);
      const res = await axios.post('/api/profile', body, config);

      dispatch(getCurrentProfile());
      dispatch(
        setAlert({
          msg: edit ? 'Profile Updated' : 'Profile Created',
          alertType: 'success',
          timeout: 5000,
        })
      );

      if (!edit) {
        navigate('/dashboard');
      }

      return res.data;
    } catch (error) {
      const errors = error.response?.data?.errors;

      if (errors) {
        errors.forEach((error) => {
          console.log('Dispatching alert for:', error.msg);
          dispatch(setAlert({ msg: error.msg, alertType: 'danger' }));
        });
      }

      return rejectWithValue(error.response?.data || 'Something went wrong');
    }
  }
);

export const getProfiles = createAsyncThunk(
  'profile/getProfiles',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get('/api/profile');
      return res.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const getGithubRepos = createAsyncThunk(
  'profile/getGithubRepos',
  async (username, { rejectWithValue }) => {
    try {
      const res = await axios.get(`/api/profile/github/${username}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    clearProfile: (state) => {
      state.profile = null;
      state.repos = [];
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCurrentProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCurrentProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(getCurrentProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getProfiles.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProfiles.fulfilled, (state, action) => {
        state.loading = false;
        state.profiles = action.payload;
      })
      .addCase(getProfiles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getGithubRepos.pending, (state) => {
        state.loading = true;
      })
      .addCase(getGithubRepos.fulfilled, (state, action) => {
        state.loading = false;
        state.repos = action.payload;
      })
      .addCase(getGithubRepos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearProfile } = profileSlice.actions;
export default profileSlice.reducer;
