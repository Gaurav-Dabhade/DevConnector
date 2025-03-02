import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentProfile } from '../../features/profileSlice';

const Dashboard = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getCurrentProfile());
  }, []);
  //   const profile = useSelector((state) => state.profile);
  //   const auth = useSelector((state) => state.auth);
  return <div>Dashboard</div>;
};

export default Dashboard;
