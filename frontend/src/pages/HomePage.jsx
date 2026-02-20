import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import ConfessionCard from '../components/ConfessionCard';
import ConfessionModal from '../components/ConfessionModal';
import Filters from '../components/Filters';
import { confessionService } from '../services/api';
import { motion } from 'framer-motion';
import {
  TrendingUp, Home, Clock, PenTool, Settings,
  LogOut, Heart, MessageCircle, Shield, Hash, Flame
} from 'lucide-react';
import './HomePage.css';

const HomePage = () => {
  const { user, logout } = useContext(AuthContext);
  const [confessions, setConfessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingConfession, setEditingConfession] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSort, setSelectedSort] = useState('newest');
  const [activeTab, setActiveTab] = useState('feed');

  useEffect(() => {
    fetchConfessions();
  }, [selectedCategory, selectedSort]);

  const fetchConfessions = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await confessionService.getAll(selectedSort, selectedCategory);
      setConfessions(response.data.confessions || []);
    } catch (err) {
      setError('Failed to load confessions');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateConfession = async (data) => {
    try {
      if (editingConfession) {
        await confessionService.update(editingConfession._id, data);
        setEditingConfession(null);
      } else {
        await confessionService.create(data);
      }
      fetchConfessions();
    } catch (err) {
      throw err;
    }
  };

  const handleReaction = async (confessionId, reactionType) => {
    if (!user) {
      alert('Please login to react');
      return;
    }
    try {
      await confessionService.react(confessionId, reactionType);
      fetchConfessions();
    } catch (err) {
      console.error('Error adding reaction:', err);
    }
  };

  const handleDeleteConfession = async (confessionId, secretCode) => {
    try {
      await confessionService.delete(confessionId, secretCode);
      fetchConfessions();
    } catch (err) {
      throw err;
    }
  };

  const handleEditConfession = (confession) => {
    if (!user || user.id !== confession.userId._id) {
      alert('You can only edit your own confessions');
      return;
    }
    setEditingConfession(confession);
    setIsModalOpen(true);
  };

  const totalReactions = confessions.reduce((sum, c) => sum + c.reactions.like + c.reactions.love + c.reactions.laugh, 0);
  const myConfessionsCount = confessions.filter(c => user && c.userId._id === user.id).length;

  return (
    <div className="home-page">
      <Navbar onConfessClick={() => setIsModalOpen(true)} />

      <div className="home-container">
        {/* Left Sidebar */}
        <aside className="sidebar sidebar-left">
          <div className="glass-panel profile-card">
            {user ? (
              <>
                <div className="profile-header">
                  <div className="avatar-container">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.displayName} />
                    ) : (
                      <div className="avatar-placeholder-lg">
                        {user.displayName?.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <h3>{user.displayName}</h3>
                  <p className="user-email">{user.email}</p>
                </div>

                <div className="stats-grid">
                  <div className="stat-box">
                    <span className="stat-val">{myConfessionsCount}</span>
                    <span className="stat-lbl">Secrets</span>
                  </div>
                  <div className="stat-box">
                    <span className="stat-val">{(totalReactions / 1000).toFixed(1)}k</span>
                    <span className="stat-lbl">Hearts</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="login-prompt-card">
                <div className="icon-circle">
                  <Shield size={24} />
                </div>
                <h3>Join SecretDiary</h3>
                <p>Share your secrets anonymously and connect with peers.</p>
              </div>
            )}
          </div>

          <nav className="glass-panel nav-menu">
            <button
              className={`nav-item ${activeTab === 'feed' ? 'active' : ''}`}
              onClick={() => setActiveTab('feed')}
            >
              <Home size={20} /> Campus Feed
            </button>
            <button
              className={`nav-item ${activeTab === 'history' ? 'active' : ''}`}
              onClick={() => setActiveTab('history')}
            >
              <Clock size={20} /> My History
            </button>
            <button className="nav-item">
              <Settings size={20} /> Settings
            </button>
            {user && (
              <button className="nav-item danger" onClick={logout}>
                <LogOut size={20} /> Logout
              </button>
            )}
          </nav>

          <button className="create-confession-btn" onClick={() => setIsModalOpen(true)}>
            <PenTool size={20} /> Write Secret
          </button>
        </aside>

        {/* Main Content */}
        <main className="main-content">
          <Filters
            selectedCategory={selectedCategory}
            selectedSort={selectedSort}
            onCategoryChange={setSelectedCategory}
            onSortChange={setSelectedSort}
          />

          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
            </div>
          ) : error ? (
            <div className="error-container glass-panel">
              <p>{error}</p>
              <button onClick={fetchConfessions} className="btn-primary">Try Again</button>
            </div>
          ) : confessions.length === 0 ? (
            <div className="empty-state glass-panel">
              <div className="empty-icon">🍃</div>
              <h3>Wait, it's so quiet...</h3>
              <p>Be the first to share a secret in {selectedCategory}.</p>
              <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
                Start Confessing
              </button>
            </div>
          ) : (
            <motion.div
              className="confessions-grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {confessions.map((confession) => (
                <ConfessionCard
                  key={confession._id}
                  confession={confession}
                  onReact={handleReaction}
                  onDelete={handleDeleteConfession}
                  onEdit={handleEditConfession}
                />
              ))}
            </motion.div>
          )}
        </main>

        {/* Right Sidebar */}
        <aside className="sidebar sidebar-right">
          <div className="glass-panel sidebar-section">
            <h3 className="section-title">
              <Shield size={18} className="text-accent" /> Safe Space Rules
            </h3>
            <ul className="rules-list">
              <li>✨ Be Kind & Supportive</li>
              <li>🔒 No Real Names</li>
              <li>🚫 No Bullying or Hate</li>
              <li>💭 Respect Boundaries</li>
            </ul>
          </div>

          <div className="glass-panel sidebar-section">
            <h3 className="section-title">
              <Flame size={18} className="text-secondary" /> Hot Topics
            </h3>
            <div className="hashtags">
              {['#crush', '#exams', '#library', '#food', '#drama', '#advice'].map(tag => (
                <span key={tag} className="tag-pill">{tag}</span>
              ))}
            </div>
          </div>

          <div className="glass-panel sidebar-section trending-card">
            <h3 className="section-title">
              <TrendingUp size={18} className="text-primary" /> Trending Now
            </h3>
            <div className="trending-list">
              <div className="trending-item">
                <span className="trend-rank">1</span>
                <div>
                  <p className="trend-topic">Library 3rd Floor</p>
                  <span className="trend-count">124 secrets</span>
                </div>
              </div>
              <div className="trending-item">
                <span className="trend-rank">2</span>
                <div>
                  <p className="trend-topic">Final Exams</p>
                  <span className="trend-count">89 secrets</span>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>

      <ConfessionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingConfession(null);
        }}
        onSubmit={handleCreateConfession}
        editingConfession={editingConfession}
      />
    </div>
  );
};

export default HomePage;
