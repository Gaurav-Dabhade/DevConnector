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
      });
  },
});

export const { clearPost } = postSlice.actions;
export default postSlice.reducer;
