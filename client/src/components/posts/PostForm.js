import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addPost } from '../../features/postSlice';

const PostForm = () => {
  const dispatch = useDispatch();
  const [text, setText] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (text.trim()) {
      // Make sure we're sending exactly what the API expects
      dispatch(addPost({ text: text.trim() }));
      setText('');
    } else {
      setError('Text is required');
    }
  };

  const handleChange = (e) => {
    const { value } = e.target;
    setText(value);
    if (error && value.trim()) {
      setError('');
    }
  };

  return (
    <div className='post-form'>
      <div className='bg-primary p'>
        <h3>Say Something...</h3>
      </div>
      <form className='form my-1' onSubmit={handleSubmit}>
        <textarea
          name='text'
          cols='30'
          rows='5'
          placeholder='Create a post'
          value={text}
          onChange={handleChange}
          required
        ></textarea>
        {error && <div className='alert alert-danger'>{error}</div>}
        <input type='submit' className='btn btn-dark my-1' value='Submit' />
      </form>
    </div>
  );
};

export default PostForm;
