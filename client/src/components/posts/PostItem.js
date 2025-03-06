import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { format } from 'date-fns';
import { addLike, removeLike, deletePost } from '../../features/postSlice';

const PostItem = ({
  post: { _id, text, name, avatar, user, likes, comments, date },
}) => {
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const formatDate = (date) => {
    return date ? format(new Date(date), 'yyyy/MM/dd') : '';
  };

  // Check for null pointer references
  if (!text || !name || !avatar || !user || !likes || !comments || !date) {
    return null;
  }

  return (
    <div className='post bg-white p-1 my-1'>
      <div>
        <Link to={`/profile/${user}`}>
          <img
            className='round-img'
            src={avatar}
            onError={(e) =>
              (e.target.src =
                'https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?s=200')
            }
            alt={name}
          />
          <h4>{name}</h4>
        </Link>
      </div>
      <div>
        <p className='my-1'>{text}</p>
        <p className='post-date'>Posted on {formatDate(date)}</p>
        <button
          onClick={() => dispatch(addLike(_id))}
          type='button'
          className='btn btn-light'
        >
          <i className='fas fa-thumbs-up'></i>{' '}
          <span>{likes.length > 0 && likes.length}</span>
        </button>
        <button
          onClick={() => dispatch(removeLike(_id))}
          type='button'
          className='btn btn-light'
        >
          <i className='fas fa-thumbs-down'></i>
        </button>
        <Link to={`/post/${_id}`} className='btn btn-primary'>
          Discussion{' '}
          {comments.length > 0 && (
            <span className='comment-count'>{comments.length}</span>
          )}
        </Link>
        {auth?.user?._id === user && (
          <button
            onClick={() => dispatch(deletePost(_id))}
            type='button'
            className='btn btn-danger'
          >
            <i className='fas fa-times'></i>
          </button>
        )}
      </div>
    </div>
  );
};

export default PostItem;
