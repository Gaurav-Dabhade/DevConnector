import React, { useEffect, Fragment } from 'react';
import { useParams, Link } from 'react-router-dom';
import Spinner from '../layout/Spinner';
import { getProfileById } from '../../features/profileSlice';
import { useDispatch, useSelector } from 'react-redux';
import ProfileTop from './ProfileTop';
import ProfileAbout from './ProfileAbout';
import ProfileExperience from './ProfileExperience';
import ProfileEducation from './ProfileEducation';
// import ProfileGithub from './ProfileGithub';

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

      <div className='profile-grid my-1'>
        <ProfileTop profile={profile} />
        <ProfileAbout profile={profile} />
        <div className='profile-exp bg-white pp-2'>
          <h2 className='text-primary'>Experience</h2>
          {profile.experience.length > 0 ? (
            <Fragment>
              {profile.experience.map((experience) => (
                <ProfileExperience
                  key={experience._id}
                  experience={experience}
                />
              ))}
            </Fragment>
          ) : (
            <h4>No experience credentials</h4>
          )}
        </div>

        <div className='profile-edu bg-white pp-2'>
          <h2 className='text-primary'>Education</h2>
          {profile.education.length > 0 ? (
            <Fragment>
              {profile.education.map((education) => (
                <ProfileEducation key={education._id} education={education} />
              ))}
            </Fragment>
          ) : (
            <h4>No education credentials</h4>
          )}
        </div>
        {/* 
        {profile.githubusername && (
          <ProfileGithub username={profile.githubusername} />
        )} */}
      </div>
    </Fragment>
  );
};

export default Profile;
