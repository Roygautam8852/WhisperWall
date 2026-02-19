import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, MoreHorizontal } from 'lucide-react';
import './ConfessionCard.css';

const ConfessionCard = ({ data, onReact }) => {
  const [isLiked, setIsLiked] = useState(data.isLiked || false);
  const [likesCount, setLikesCount] = useState(data.likes);

  const handleLike = () => {
    const newLiked = !isLiked;
    setIsLiked(newLiked);
    setLikesCount(newLiked ? likesCount + 1 : likesCount - 1);
    onReact(data.id, newLiked ? 'like' : 'unlike');
  };

  const getCategoryColor = (cat) => {
    switch (cat.toLowerCase()) {
      case 'study': return 'bg-blue-100 text-blue-800';
      case 'crush': return 'bg-pink-100 text-pink-800';
      case 'funny': return 'bg-yellow-100 text-yellow-800';
      case 'rant': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="confession-card">
      <div className="card-header">
        <div className="user-info">
          <div className="avatar-circle">
            {data.author.charAt(0)}
          </div>
          <div className="meta-info">
            <h4>{data.author}</h4>
            <span className="timestamp">{new Date(data.timestamp).toLocaleDateString()} • {new Date(data.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>
        <span className={`tag ${data.category.toLowerCase()}`}>
          {data.category}
        </span>
      </div>

      <div className="card-body">
        <p>{data.content}</p>
        <div className="hashtags">
          {data.hashtags && data.hashtags.map((tag, idx) => (
            <span key={idx} className="hashtag">{tag}</span>
          ))}
        </div>
      </div>

      <div className="card-footer">
        <div className="actions">
          <button
            className={`action-btn ${isLiked ? 'liked' : ''}`}
            onClick={handleLike}
          >
            <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
            <span>{likesCount}</span>
          </button>

          <button className="action-btn">
            <MessageCircle size={18} />
            <span>{data.comments}</span>
          </button>
        </div>

        <button className="share-btn">
          <Share2 size={18} />
        </button>
      </div>
    </div>
  );
};

export default ConfessionCard;
