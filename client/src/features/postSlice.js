import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { setAlert } from './alertSlice';

// Initial state
const initialState = {
  posts: [],
  post: null,
  loading: true,
  error: {},
};

export const getPosts = createAsyncThunk(
  'post/getPosts',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`/api/posts`);
      return res.data;
    } catch (err) {
      return rejectWithValue({
        msg: err.response.statusText,
        status: err.response.status,
      });
    }
  }
);

//Add like
export const addLike = createAsyncThunk(
  'post/addLike',
  async (postId, { rejectWithValue }) => {
    try {
      const res = await axios.put(`/api/posts/like/${postId}`);
      return { postId, likes: res.data };
    } catch (err) {
      if (err.response && err.response.data) {
        const { data } = err.response;
        if (data.errors) {
          data.errors.forEach((error) =>
            console.log('Error:', error.msg, error.param)
          );
        }
        return rejectWithValue({
          msg: data.msg || err.message,
          status: err.response.status,
        });
      }
      return rejectWithValue({
        msg: err.message,
        status: 500,
      });
    }
  }
);

//Remove like
export const removeLike = createAsyncThunk(
  'post/removeLike',
  async (postId, { rejectWithValue }) => {
    try {
      const res = await axios.put(`/api/posts/unlike/${postId}`);
      return { postId, likes: res.data };
    } catch (err) {
      if (err.response && err.response.data) {
        const { data } = err.response;
        if (data.errors) {
          data.errors.forEach((error) =>
            console.log('Error:', error.msg, error.param)
          );
        }
        return rejectWithValue({
          msg: data.msg || err.message,
          status: err.response.status,
        });
      }
      return rejectWithValue({
        msg: err.message,
        status: 500,
      });
    }
  }
);

//Delete Post

export const deletePost = createAsyncThunk(
  'post/deletePost',
  async (id, { dispatch, rejectWithValue }) => {
    try {
      await axios.delete(`/api/posts/${id}`);

      dispatch(
        setAlert({
          msg: 'Post is Removed',
          alertType: 'success',
          timeout: 5000,
        })
      );
      return { id };
    } catch (err) {
      return rejectWithValue({
        msg: err.response.statusText,
        status: err.response.status,
      });
    }
  }
);

//add Post

//add Post - MODIFIED WITH DEBUGGING
export const addPost = createAsyncThunk(
  'post/addPost',
  async (formData, { dispatch, rejectWithValue }) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    // Log the exact data being sent
    console.log('Sending form data:', formData);

    try {
      // Ensure we're sending exactly what the API expects
      const body = JSON.stringify(formData);
      console.log('Stringified body:', body);

      const res = await axios.post(`/api/posts`, body, config);
      console.log('Server response:', res.data);

      dispatch(
        setAlert({
          msg: 'Post Created',
          alertType: 'success',
          timeout: 5000,
        })
      );
      return res.data;
    } catch (err) {
      console.error('Error details:', err.response?.data);

      const errorMsg =
        err.response?.data?.errors?.[0]?.msg ||
        err.response?.statusText ||
        'Error creating post';

      dispatch(
        setAlert({
          msg: errorMsg,
          alertType: 'danger',
          timeout: 5000,
        })
      );

      return rejectWithValue({
        msg: errorMsg,
        status: err.response?.status || 500,
      });
    }
  }
);
export const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    clearPost: (state) => {
      state.post = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPosts.pending, (state) => {
        state.loading = true;
      })
      .addCase(getPosts.fulfilled, (state, { payload }) => {
        state.posts = payload;
        state.loading = false;
      })
      .addCase(getPosts.rejected, (state, { payload }) => {
        state.error = payload;
        state.loading = false;
      })

      .addCase(addLike.fulfilled, (state, action) => {
        state.posts = state.posts.map((post) =>
          post._id === action.payload.postId
            ? { ...post, likes: action.payload.likes }
            : post
        );
        state.loading = false;
      })
      .addCase(addLike.rejected, (state, { payload }) => {
        state.error = payload;
        state.loading = false;
      })

      .addCase(removeLike.fulfilled, (state, action) => {
        state.posts = state.posts.map((post) =>
          post._id === action.payload.postId
            ? { ...post, likes: action.payload.likes }
            : post
        );
        state.loading = false;
      })
      .addCase(removeLike.rejected, (state, { payload }) => {
        state.error = payload;
        state.loading = false;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.posts = state.posts.filter(
          (post) => post._id !== action.payload.id
        );
        state.loading = false;
      })
      .addCase(deletePost.rejected, (state, { payload }) => {
        state.error = payload;
        state.loading = false;
      })
      .addCase(addPost.fulfilled, (state, action) => {
        state.posts.unshift(action.payload);
        state.loading = false;
      })
      .addCase(addPost.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export const { clearPost } = postSlice.actions;
export default postSlice.reducer;
