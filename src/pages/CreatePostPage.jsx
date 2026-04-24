import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import { postsAPI } from '../api/client';
import { validatePostMessage, validateCoordinates } from '../utils/validation';
import '../components/CreatePost.css';

export function CreatePostPage() {
  const [message, setMessage] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [errors, setErrors] = useState({});
  const { loading, error, execute } = useApi();
  const navigate = useNavigate();

  const getGeolocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude.toString());
          setLongitude(position.coords.longitude.toString());
        },
        (err) => {
          console.error('Geolocation error:', err);
          alert('Could not get your location. Please enter manually.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!validatePostMessage(message)) {
      newErrors.message = 'Message is required (max 1000 characters)';
    }

    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);
    if (!validateCoordinates(latitude, longitude)) {
      newErrors.coordinates = 'Invalid coordinates. Latitude: -90 to 90, Longitude: -180 to 180';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const result = await execute(() => postsAPI.create(message, lat, lon));
    if (result.success) {
      navigate('/feed');
    } else {
      setErrors({ submit: result.message });
    }
  };

  return (
    <div className="create-post-container">
      <div className="create-post-card">
        <h1>Create a New Post</h1>
        {error && <div className="error-banner">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                setErrors({ ...errors, message: '' });
              }}
              placeholder="Share your travel impression (max 1000 characters)"
              maxLength={1000}
            />
            <div className="char-count">{message.length} / 1000</div>
            {errors.message && <span className="error-message">{errors.message}</span>}
          </div>

          <div className="coordinates-section">
            <div className="form-group">
              <label htmlFor="latitude">Latitude</label>
              <input
                id="latitude"
                type="number"
                step="0.000001"
                min="-90"
                max="90"
                value={latitude}
                onChange={(e) => {
                  setLatitude(e.target.value);
                  setErrors({ ...errors, coordinates: '' });
                }}
                placeholder="-90 to 90"
              />
            </div>

            <div className="form-group">
              <label htmlFor="longitude">Longitude</label>
              <input
                id="longitude"
                type="number"
                step="0.000001"
                min="-180"
                max="180"
                value={longitude}
                onChange={(e) => {
                  setLongitude(e.target.value);
                  setErrors({ ...errors, coordinates: '' });
                }}
                placeholder="-180 to 180"
              />
            </div>

            <button
              type="button"
              className="btn-secondary"
              onClick={getGeolocation}
              title="Use your current location"
            >
              📍 Use My Location
            </button>
          </div>

          {errors.coordinates && <span className="error-message">{errors.coordinates}</span>}
          {errors.submit && <span className="error-message">{errors.submit}</span>}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Creating...' : 'Create Post'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreatePostPage;
