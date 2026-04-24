import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import ReactionButtons from './ReactionButtons';
import '../components/PostCard.css';

export function PostCard({ post, onPostDeleted }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    setIsDeleting(true);
    try {
      // Will be implemented in Phase 4
      onPostDeleted?.(post.id);
    } catch (err) {
      console.error('Delete error:', err);
    }
    setIsDeleting(false);
  };

  const isOwner = user?.id === post.user?.id;
  const userReaction = post.user_reaction;
  const likeCount = post.likes_count || 0;
  const dislikeCount = post.dislikes_count || 0;
  const commentCount = post.comments_count || 0;

  return (
    <div className="post-card">
      <div className="post-header">
        <div className="post-author">
          <strong>{post.user?.name || 'Anonymous'}</strong>
          <span className="post-date">{new Date(post.created_at).toLocaleDateString()}</span>
        </div>
        {isOwner && (
          <button
            className="btn-danger btn-small"
            onClick={handleDelete}
            disabled={isDeleting}
            title="Delete post"
          >
            ✕
          </button>
        )}
      </div>

      <div className="post-content">
        <p className="post-message">{post.message}</p>
        <div className="post-location">
          📍 {post.latitude.toFixed(2)}°, {post.longitude.toFixed(2)}°
        </div>
      </div>

      <div className="post-footer">
        <ReactionButtons post={post} />
        <span className="comment-count" onClick={() => navigate(`/posts/${post.id}`)}>
          💬 {commentCount} Comments
        </span>
      </div>

      <button className="btn-link" onClick={() => navigate(`/posts/${post.id}`)}>
        View Details →
      </button>
    </div>
  );
}

export default PostCard;
