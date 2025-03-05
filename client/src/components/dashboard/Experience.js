import React, { Fragment } from 'react';
import { useDispatch } from 'react-redux';
import { format } from 'date-fns';
import { deleteExperience } from '../../features/profileSlice';

const Experience = ({ experience }) => {
  const dispatch = useDispatch();
  const formatDate = (date) => {
    return date ? format(new Date(date), 'yyyy/MM/dd') : '';
  };

  const experiences = experience.map((exp) => (
    <tr key={exp._id}>
      <td>{exp.company}</td>
      <td className='hide-sm'>{exp.title}</td>
      <td>
        {formatDate(exp.from)} - {exp.to === null ? 'Now' : formatDate(exp.to)}
      </td>
      <td>
        <button
          className='btn btn-danger'
          onClick={() => dispatch(deleteExperience(exp._id))}
        >
          Delete
        </button>
      </td>
    </tr>
  ));

  return (
    <Fragment>
      <h2 className='my-2'>Experience Credentials</h2>
      <table className='table'>
        <thead>
          <tr>
            <th>Company</th>
            <th className='hide-sm'>Title</th>
            <th className='hide-sm'>Years</th>
            <th></th>
          </tr>
        </thead>
        <tbody>{experiences}</tbody>
      </table>
    </Fragment>
  );
};

export default Experience;
