// // import { createStore, applyMiddleware } from 'redux';
// // import { composeWithDevTools } from 'redux-devtools-extension';

// import { configureStore } from '@reduxjs/toolkit';
// import rootReducer from './reducers';

// const store = configureStore({
//   reducer: rootReducer,
//   middleware: (getDefaultMiddleware) => getDefaultMiddleware(), // Thunk is included by default
// });

// export default store;

import { configureStore } from '@reduxjs/toolkit';
import alertReducer from './features/alertSlice';
import authReducer from './features/authSlice';
import profileReducer from './features/profileSlice';

export const store = configureStore({
  reducer: {
    alert: alertReducer,
    auth: authReducer,
    profile: profileReducer,
  },
});

export default store;
