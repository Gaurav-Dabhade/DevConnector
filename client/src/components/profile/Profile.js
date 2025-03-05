import React, { useEffect, Fragment } from 'react';
import { useParams, Link } from 'react-router-dom';
import Spinner from '../layout/Spinner';
import { getProfileById } from '../../features/profileSlice';
import { useDispatch, useSelector } from 'react-redux';
import ProfileTop from './ProfileTop';
import ProfileAbout from './ProfileAbout';

const Profile = () => {
  const dispatch = useDispatch();
  const { profile, loading } = useSelector((state) => state.profile);
  const {
    isAuthenticated,
    loading: authLoading,
    user,
  } = useSelector((state) => state.auth);
  const { id } = useParams();

  useEffect(() => {
    dispatch(getProfileById(id));
  }, [dispatch, id]);

  // Check for loading states and null/undefined conditions
  if (loading || authLoading) {
    return <Spinner />;
  }

  // Check if profile is null or undefined
  if (!profile) {
    return <div>Profile not found</div>;
  }

  return (
    <Fragment>
      <Link to='/profiles' className='btn btn-light'>
        Back To Profiles
      </Link>
      {isAuthenticated &&
        user &&
        profile.user &&
        user._id === profile.user._id && (
          <Link to='/edit-profile' className='btn btn-dark'>
            Edit Profile
          </Link>
        )}

      <div class='profile-grid my-1'>
        <ProfileTop profile={profile} />
        <ProfileAbout profile={profile} />
      </div>
    </Fragment>
  );
};

export default Profile;
