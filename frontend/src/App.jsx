import React, { useState, useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Feed from './pages/Feed';
import ProfilePage from './pages/ProfilePage';
import TrendsPage from './pages/TrendsPage';
import CreateModal from './components/CreateModal';
import LandingPage from './pages/LandingPage';
import './App.css';
import feedsData from './data/feeds.json';

const App = () => {
  const { user, loading } = useContext(AuthContext);

  const [activeTab, setActiveTab] = useState('feed');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confessions, setConfessions] = useState(feedsData);
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortOption, setSortOption] = useState('Newest');

  // ── Auth Gate ──────────────────────────────────────────────
  // Show full-screen spinner while session is being resolved
  if (loading) {
    return (
      <div className="app-loading">
        <div className="app-loading-spinner" />
        <p>Loading WhisperWall…</p>
      </div>
    );
  }

  // Not logged in → show landing page (with embedded Login/Signup modal)
  if (!user) {
    return <LandingPage />;
  }
  // ──────────────────────────────────────────────────────────

  const handlePost = (newConfession) => {
    const post = {
      id: confessions.length + 1,
      author: newConfession.author,
      timestamp: new Date().toISOString(),
      category: newConfession.category,
      content: newConfession.content,
      hashtags: newConfession.hashtags || [],
      likes: 0,
      comments: 0,
      isLiked: false,
    };
    setConfessions([post, ...confessions]);
  };

  const handleReact = (id, type) => {
    setConfessions(confessions.map(post => {
      if (post.id === id) {
        return type === 'like'
          ? { ...post, likes: post.likes + 1, isLiked: true }
          : { ...post, likes: post.likes - 1, isLiked: false };
      }
      return post;
    }));
  };

  const categories = ['All', 'Study', 'Crush', 'Funny', 'Rant'];

  const renderContent = () => {
    switch (activeTab) {
      case 'feed':
        return (
          <Feed
            confessions={confessions}
            onReact={handleReact}
            categories={categories}
            activeCategory={activeCategory}
            activeTab={activeTab}
            onCategoryChange={setActiveCategory}
            sortOption={sortOption}
            onSortChange={setSortOption}
          />
        );
      case 'profile': return <ProfilePage />;
      case 'trends': return <TrendsPage />;
      default: return null;
    }
  };

  return (
    <div className="app-root">
      {/* Sticky Navbar */}
      <Navbar onConfessClick={() => setIsModalOpen(true)} />

      <div className="app-body">
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onCreateClick={() => setIsModalOpen(true)}
        />

        <main className="main-content-area">
          {renderContent()}
        </main>
      </div>

      <CreateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onPost={handlePost}
      />
    </div>
  );
};

export default App;
