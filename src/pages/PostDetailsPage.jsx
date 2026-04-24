import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useApi } from '../hooks/useApi';
import { postsAPI } from '../api/client';
import CommentList from '../components/CommentList';
import CommentForm from '../components/CommentForm';
import ReactionButtons from '../components/ReactionButtons';
import LoadingSpinner from '../components/LoadingSpinner';
import '../components/PostDetails.css';

export function PostDetailsPage() {
  const { postId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const { loading, error, execute, setError } = useApi();
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchPost();
  }, [postId]);

  const fetchPost = async () => {
    const result = await execute(() => postsAPI.getOne(postId));
    if (result.success) {
      setPost(result.data.data);
    }
  };

  const handleDeletePost = async () => {
    if (!window.confirm('Are you sure you want to delete this post? This cannot be undone.')) {
      return;
    }

    setIsDeleting(true);
    const result = await execute(() => postsAPI.delete(postId));
    if (result.success) {
      navigate('/feed');
    }
    setIsDeleting(false);
  };

  const handleCommentAdded = (newComment) => {
    setComments([...comments, newComment]);
    if (post) {
      setPost({ ...post, comments_count: (post.comments_count || 0) + 1 });
    }
  };

  const handleCommentDeleted = (commentId) => {
    setComments(comments.filter((c) => c.id !== commentId));
    if (post) {
      setPost({ ...post, comments_count: Math.max(0, (post.comments_count || 1) - 1) });
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!post) {
    return (
      <div className="post-details-container">
        <div className="error-message">Post not found.</div>
      </div>
    );
  }

  const isOwner = user?.id === post.user?.id;

  return (
    <div className="post-details-container">
      <button className="btn-link" onClick={() => navigate('/feed')}>
        ← Back to Feed
      </button>

      <div className="post-details-card">
        <div className="post-header">
          <div>
            <h1>{post.user?.name || 'Anonymous'}</h1>
            <p className="post-date">{new Date(post.created_at).toLocaleString()}</p>
          </div>
          {isOwner && (
            <button
              className="btn-danger"
              onClick={handleDeletePost}
              disabled={isDeleting}
              title="Delete post"
            >
              {isDeleting ? 'Deleting...' : 'Delete Post'}
            </button>
          )}
        </div>

        <div className="post-content">
          <p className="post-message">{post.message}</p>
          <div className="post-location">
            📍 Coordinates: {post.latitude.toFixed(4)}°, {post.longitude.toFixed(4)}°
          </div>
        </div>

        <div className="post-reactions">
          <ReactionButtons post={post} />
        </div>

        {error && <div className="error-banner">{error}</div>}
      </div>

      <div className="comments-section">
        <h2>Comments ({post.comments_count || 0})</h2>
        <CommentForm postId={postId} onCommentAdded={handleCommentAdded} />
        <CommentList postId={postId} onCommentDeleted={handleCommentDeleted} />
      </div>
    </div>
  );
}

export default PostDetailsPage;
