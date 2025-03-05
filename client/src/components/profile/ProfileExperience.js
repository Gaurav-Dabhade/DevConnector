import React from 'react';
import { format } from 'date-fns';

const ProfileExperience = ({
  experience: { company, title, location, current, to, from, description },
}) => {
  const formatDate = (date) => {
    return date ? format(new Date(date), 'yyyy/MM/dd') : '';
  };
  return (
    <div>
      <h3 className='text-dark'>{company}</h3>
      <p>
        {formatDate(from)} - {!to ? 'Now' : formatDate(to)}
      </p>
      <p>
        <strong>Position:</strong> {title}
      </p>
      <p>
        <strong>Description:</strong> {description}
      </p>
    </div>
  );
};

export default ProfileExperience;
