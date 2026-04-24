import { useState } from 'react';
import { useApi } from '../hooks/useApi';
import { reactionsAPI } from '../api/client';
import '../components/Reactions.css';

export function ReactionButtons({ post }) {
  const [reactions, setReactions] = useState({
    likes: post.likes_count || 0,
    dislikes: post.dislikes_count || 0,
    userReaction: post.user_reaction || null,
  });
  const { loading, execute } = useApi();

  const handleReaction = async (type) => {
    const isCurrentReaction = reactions.userReaction === type;

    if (isCurrentReaction) {
      // Remove reaction
      const result = await execute(() => reactionsAPI.remove(post.id));
      if (result.success) {
        setReactions((prev) => ({
          ...prev,
          likes: prev.userReaction === 'like' ? prev.likes - 1 : prev.likes,
          dislikes: prev.userReaction === 'dislike' ? prev.dislikes - 1 : prev.dislikes,
          userReaction: null,
        }));
      }
    } else {
      // Add reaction
      const result = await execute(() => reactionsAPI.set(post.id, type));
      if (result.success) {
        setReactions((prev) => {
          let newLikes = prev.likes;
          let newDislikes = prev.dislikes;

          if (prev.userReaction === 'like') newLikes--;
          if (prev.userReaction === 'dislike') newDislikes--;

          if (type === 'like') newLikes++;
          if (type === 'dislike') newDislikes++;

          return {
            likes: newLikes,
            dislikes: newDislikes,
            userReaction: type,
          };
        });
      }
    }
  };

  return (
    <div className="reaction-buttons">
      <button
        className={`reaction-btn ${reactions.userReaction === 'like' ? 'active' : ''}`}
        onClick={() => handleReaction('like')}
        disabled={loading}
        title="Like"
      >
        👍 {reactions.likes}
      </button>
      <button
        className={`reaction-btn ${reactions.userReaction === 'dislike' ? 'active' : ''}`}
        onClick={() => handleReaction('dislike')}
        disabled={loading}
        title="Dislike"
      >
        👎 {reactions.dislikes}
      </button>
    </div>
  );
}

export default ReactionButtons;
