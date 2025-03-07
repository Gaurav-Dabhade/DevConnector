import React, { useEffect, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPost } from '../../features/postSlice';
import Spinner from '../layout/Spinner';
import { Link, useParams } from 'react-router-dom';
import PostItem from '../posts/PostItem';
import CommentForm from './CommentForm';
import CommentItem from './CommentItem';

const Post = () => {
  const { post, loading } = useSelector((state) => state.post);
  const dispatch = useDispatch();
  const { id } = useParams();
  useEffect(() => {
    dispatch(getPost(id));
  }, [dispatch, id]);

  // Add this effect to refetch post after comment is added
  const { commentStatus } = useSelector((state) => state.post);

  useEffect(() => {
    if (commentStatus === 'succeeded') {
      dispatch(getPost(id));
    }
  }, [commentStatus, dispatch, id]);

  return loading || post === null ? (
    <Spinner />
  ) : (
    <Fragment>
      <Link to='/posts' className='btn'>
        Back to Posts
      </Link>
      <PostItem post={post} showActions={false} />
      <CommentForm postId={post._id} />
      <div className='comments'>
        {post.comments.map((comment) => (
          <CommentItem key={comment._id} comment={comment} postId={post._id} />
        ))}
      </div>
    </Fragment>
  );
};

export default Post;
