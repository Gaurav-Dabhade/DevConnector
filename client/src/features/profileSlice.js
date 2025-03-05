import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { setAlert } from './alertSlice';
import { accountDeleted } from './authSlice';

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

//Get Profile By ID

export const getProfileById = createAsyncThunk(
  'profile/getProfileById',
  async (userId, { dispatch, rejectWithValue }) => {
    try {
      const res = await axios.get(`/api/profile/user/${userId}`);
      return res.data;
    } catch (err) {
      return rejectWithValue({
        msg: err.response.statusText,
        status: err.response.status,
      });
    }
  }
);

export const getProfiles = createAsyncThunk(
  'profile/getProfiles',
  async (_, { dispatch, rejectWithValue }) => {
    dispatch(clearProfile());
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

//Add Experience
export const addExperience = createAsyncThunk(
  'profile/addExperience',
  async ({ formData, navigate }, { dispatch, rejectWithValue }) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const body = JSON.stringify(formData);
      const res = await axios.put('/api/profile/experience', body, config);

      dispatch(getCurrentProfile());
      dispatch(
        setAlert({
          msg: 'Experience Added',
          alertType: 'success',
          timeout: 5000,
        })
      );

      navigate('/dashboard');

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

//Add Education
export const addEducation = createAsyncThunk(
  'profile/addEducation',
  async ({ formData, navigate }, { dispatch, rejectWithValue }) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const body = JSON.stringify(formData);
      const res = await axios.put('/api/profile/education', body, config);

      dispatch(getCurrentProfile());
      dispatch(
        setAlert({
          msg: 'Education Added',
          alertType: 'success',
          timeout: 5000,
        })
      );

      navigate('/dashboard');

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

//Delete Experience
export const deleteExperience = createAsyncThunk(
  'profile/deleteExperience',
  async (id, { dispatch, rejectWithValue }) => {
    try {
      const res = await axios.delete(`/api/profile/experience/${id}`);

      dispatch(getCurrentProfile());
      dispatch(
        setAlert({
          msg: 'Experience Removed',
          timeout: 5000,
        })
      );
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

//Delete Education
export const deleteEducation = createAsyncThunk(
  'profile/deleteEducation',
  async (id, { dispatch, rejectWithValue }) => {
    try {
      const res = await axios.delete(`/api/profile/education/${id}`);

      dispatch(getCurrentProfile());
      dispatch(
        setAlert({
          msg: 'Education Removed',
          timeout: 5000,
        })
      );
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

//Delete Account & Profile

//Delete Education
export const deleteAccount = createAsyncThunk(
  'profile/deleteAccount',
  async (_, { dispatch, rejectWithValue }) => {
    if (window.confirm('Are you sure? This can Not be undone')) {
      try {
        const res = await axios.delete('/api/profile');

        dispatch(clearProfile());
        dispatch(accountDeleted());
        dispatch(
          setAlert({
            msg: 'Your Account has been permanantly deleted Removed',
            timeout: 5000,
          })
        );
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
      .addCase(getProfileById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProfileById.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(getProfileById.rejected, (state, action) => {
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
