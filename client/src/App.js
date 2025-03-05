import React, { Fragment, useEffect } from 'react';
import store from './store';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Alert from './components/layout/Alert';
import { loadUser } from './features/authSlice';
import setAuthToken from './utils/setAuthToken';
import Dashboard from './components/dashboard/Dashboard';
import PrivateRoute from './components/routing/PrivateRoute';
import AddExperience from './components/profile-forms/AddExperience';
import AddEducation from './components/profile-forms/AddEducation';
import CreateProfile from './components/profile-forms/CreateProfile';

import EditProfile from './components/profile-forms/EditProfile';
//Redux
import { Provider } from 'react-redux';

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const App = () => {
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <Fragment>
          <Navbar />

          <Routes>
            <Route path='/' element={<Landing />} />
            <Route
              path='/register'
              element={
                <section className='container'>
                  <Alert />
                  <Register />
                </section>
              }
            />
            <Route
              path='/login'
              element={
                <section className='container'>
                  <Alert />
                  <Login />
                </section>
              }
            />
            <Route
              path='/dashboard'
              element={
                <section className='container'>
                  <Alert />
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                </section>
              }
            />
            <Route
              path='/create-profile'
              element={
                <section className='container'>
                  <Alert />
                  <PrivateRoute>
                    <CreateProfile />
                  </PrivateRoute>
                </section>
              }
            />
            <Route
              path='/edit-profile'
              element={
                <section className='container'>
                  <Alert />
                  <PrivateRoute>
                    <EditProfile />
                  </PrivateRoute>
                </section>
              }
            />

            <Route
              path='/add-experience'
              element={
                <section className='container'>
                  <Alert />
                  <PrivateRoute>
                    <AddExperience />
                  </PrivateRoute>
                </section>
              }
            />
            <Route
              path='/add-education'
              element={
                <section className='container'>
                  <Alert />
                  <PrivateRoute>
                    <AddEducation />
                  </PrivateRoute>
                </section>
              }
            />
          </Routes>
        </Fragment>
      </Router>
    </Provider>
  );
};

export default App;
