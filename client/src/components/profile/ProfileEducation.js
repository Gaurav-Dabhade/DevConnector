import React from 'react';
import { format } from 'date-fns';

const ProfileEducation = ({
  education: { school, degree, fieldofstudy, current, to, from, description },
}) => {
  const formatDate = (date) => {
    return date ? format(new Date(date), 'yyyy/MM/dd') : '';
  };
  return (
    <div>
      <h3 className='text-dark'>{school}</h3>
      <p>
        {formatDate(from)} - {!to ? 'Now' : formatDate(to)}
      </p>
      <p>
        <strong>Degree:</strong> {degree}
      </p>
      <p>
        <strong>Field Of Study:</strong> {fieldofstudy}
      </p>
      <p>
        <strong>Description:</strong> {description}
      </p>
    </div>
  );
};

export default ProfileEducation;
