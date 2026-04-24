import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useApi } from '../hooks/useApi';
import { commentsAPI } from '../api/client';
import LoadingSpinner from './LoadingSpinner';
import '../components/Comments.css';

export function CommentList({ postId, onCommentDeleted }) {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const { loading, error, execute } = useApi();
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    const result = await execute(() => commentsAPI.getByPost(postId, { per_page: 50 }));
    if (result.success) {
      const data = result.data.data || [];
      setComments(Array.isArray(data) ? data : []);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Delete this comment?')) {
      return;
    }

    setDeletingId(commentId);
    const result = await execute(() => commentsAPI.delete(commentId));
    if (result.success) {
      setComments(comments.filter((c) => c.id !== commentId));
      onCommentDeleted?.(commentId);
    }
    setDeletingId(null);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="comment-list">
      {error && <div className="error-banner">{error}</div>}

      {comments.length === 0 ? (
        <div className="empty-state">
          <p>No comments yet. Be the first to comment!</p>
        </div>
      ) : (
        comments.map((comment) => (
          <div key={comment.id} className="comment-item">
            <div className="comment-header">
              <strong>{comment.user?.name || 'Anonymous'}</strong>
              <span className="comment-date">{new Date(comment.created_at).toLocaleDateString()}</span>
              {user?.id === comment.user?.id && (
                <button
                  className="btn-danger btn-small"
                  onClick={() => handleDeleteComment(comment.id)}
                  disabled={deletingId === comment.id}
                  title="Delete comment"
                >
                  ✕
                </button>
              )}
            </div>
            <p className="comment-text">{comment.message}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default CommentList;
