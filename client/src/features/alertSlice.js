import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

// Initial state
const initialState = {
  alerts: [],
};
// Simple synchronous action creator for setting alerts
export const setAlert =
  ({ msg, alertType, timeout = 5000 }) =>
  (dispatch) => {
    if (!msg || !alertType) {
      throw new Error('msg and alertType are required');
    }

    const id = uuidv4();

    // Dispatch the addAlert action
    dispatch(addAlert({ id, msg, alertType }));

    // Set timeout to remove the alert
    setTimeout(() => {
      dispatch(removeAlert(id));
    }, timeout);
  };

// Create the alert slice first so we can use its actions
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
});

// Export the action creators
export const { addAlert, removeAlert } = alertSlice.actions;

export default alertSlice.reducer;
