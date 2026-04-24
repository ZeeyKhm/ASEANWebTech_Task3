import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useApi } from '../hooks/useApi';
import { postsAPI } from '../api/client';
import LoadingSpinner from '../components/LoadingSpinner';
import '../components/Map.css';

export function MapPage() {
  const [posts, setPosts] = useState([]);
  const { loading, error, execute } = useApi();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const result = await execute(() => postsAPI.getAll({ per_page: 100 }));
    if (result.success) {
      const data = result.data.data || [];
      setPosts(Array.isArray(data) ? data : []);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="map-container">
      <h1>Map View</h1>
      {error && <div className="error-banner">{error}</div>}

      <div className="map-wrapper">
        <MapContainer center={[20, 0]} zoom={2} className="map">
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />

          {posts.map((post) => (
            <Marker key={post.id} position={[post.latitude, post.longitude]}>
              <Popup>
                <div className="popup-content">
                  <strong>{post.user?.name || 'Anonymous'}</strong>
                  <p>{post.message}</p>
                  <a href={`/posts/${post.id}`}>View Details</a>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {posts.length === 0 && (
        <div className="empty-state">
          <p>No posts to display on the map.</p>
        </div>
      )}
    </div>
  );
}

export default MapPage;
