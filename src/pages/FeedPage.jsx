import { useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi';
import { postsAPI } from '../api/client';
import PostCard from '../components/PostCard';
import LoadingSpinner from '../components/LoadingSpinner';
import '../components/Feed.css';

export function FeedPage() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { loading, error, execute } = useApi();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const result = await execute(() => postsAPI.getAll({ page: 1, per_page: 20 }));
    if (result.success) {
      const feedData = result.data.data || [];
      setPosts(Array.isArray(feedData) ? feedData : []);
      setHasMore((result.data.meta?.has_more) ?? feedData.length >= 20);
    }
  };

  const handleLoadMore = async () => {
    const nextPage = page + 1;
    const result = await execute(() => postsAPI.getAll({ page: nextPage, per_page: 20 }));
    if (result.success) {
      const newPosts = result.data.data || [];
      setPosts([...posts, ...(Array.isArray(newPosts) ? newPosts : [])]);
      setPage(nextPage);
      setHasMore((result.data.meta?.has_more) ?? newPosts.length >= 20);
    }
  };

  const handlePostDeleted = (postId) => {
    setPosts(posts.filter((p) => p.id !== postId));
  };

  if (loading && posts.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <div className="feed-container">
      <h1>Feed</h1>
      {error && <div className="error-banner">{error}</div>}

      {posts.length === 0 && !loading ? (
        <div className="empty-state">
          <p>No posts yet. Be the first to share a location!</p>
        </div>
      ) : (
        <div className="posts-list">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} onPostDeleted={handlePostDeleted} />
          ))}
        </div>
      )}

      {hasMore && (
        <div className="load-more-container">
          <button onClick={handleLoadMore} className="btn-secondary" disabled={loading}>
            {loading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </div>
  );
}

export default FeedPage;
