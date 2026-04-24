import { useState } from 'react';
import { useApi } from '../hooks/useApi';
import { commentsAPI } from '../api/client';
import { validateCommentMessage } from '../utils/validation';
import '../components/Comments.css';

export function CommentForm({ postId, onCommentAdded }) {
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const { loading, error, execute } = useApi();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!validateCommentMessage(message)) {
      newErrors.message = 'Comment is required (max 500 characters)';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const result = await execute(() => commentsAPI.create(postId, message));
    if (result.success) {
      onCommentAdded?.(result.data.data);
      setMessage('');
      setErrors({});
    } else {
      setErrors({ submit: result.message });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="comment-form">
      {error && <div className="error-banner">{error}</div>}

      <div className="form-group">
        <textarea
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            setErrors({ ...errors, message: '' });
          }}
          placeholder="Add a comment (max 500 characters)"
          maxLength={500}
          rows={3}
        />
        <div className="char-count">{message.length} / 500</div>
        {errors.message && <span className="error-message">{errors.message}</span>}
      </div>

      {errors.submit && <span className="error-message">{errors.submit}</span>}

      <button type="submit" className="btn-primary" disabled={loading}>
        {loading ? 'Posting...' : 'Post Comment'}
      </button>
    </form>
  );
}

export default CommentForm;
