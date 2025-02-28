// alertSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid'; // For generating unique IDs

// Initial state
const initialState = {
  alerts: [],
};

// Async thunk for setting an alert with auto-removal
export const setAlert = createAsyncThunk(
  'alert/setAlert',
  async ({ msg, alertType, timeout = 5000 }, { dispatch }) => {
    // Validate required parameters
    if (!msg || !alertType) {
      throw new Error('msg and alertType are required');
    }

    const id = uuidv4();

    // Add the alert directly using our action
    const alertData = { id, msg, alertType };
    dispatch(addAlert(alertData));

    // Set a timeout to automatically remove the alert
    setTimeout(() => {
      dispatch(removeAlert(id));
    }, timeout);

    // We don't need to return anything for the fulfilled state
    // since we're already dispatching the addAlert action
    return null;
  }
);

// Create the alert slice
const alertSlice = createSlice({
  name: 'alert',
  initialState,
  reducers: {
    addAlert: (state, action) => {
      state.alerts.push(action.payload);
    },
    removeAlert: (state, action) => {
      state.alerts = state.alerts.filter(
        (alert) => alert.id !== action.payload
      );
    },
  },
  // No extraReducers needed since we're dispatching actions directly
});

// Export actions and reducer
export const { addAlert, removeAlert } = alertSlice.actions;
export default alertSlice.reducer;
