import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Feed from './pages/Feed';
import ProfilePage from './pages/ProfilePage';
import TrendsPage from './pages/TrendsPage';
import ChatsPage from './pages/ChatsPage';
import CreateModal from './components/CreateModal';
import LandingPage from './pages/LandingPage';
import { confessionService } from './services/api';
import './App.css';

const App = () => {
  const { user, loading } = useContext(AuthContext);

  const [activeTab, setActiveTab] = useState('feed');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confessions, setConfessions] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const [editingConfession, setEditingConfession] = useState(null);

  // ── Fetch confessions from API ──────────────────────────────
  useEffect(() => {
    if (user) {
      const fetchConfessions = async () => {
        try {
          const res = await confessionService.getAll('newest', activeCategory);
          setConfessions(res.data.confessions || []);
        } catch (err) {
          console.error("Failed to fetch confessions:", err);
        }
      };
      fetchConfessions();
    }
  }, [user, activeCategory, refreshKey]);

  // ── Auth Gate ──────────────────────────────────────────────
  if (loading) {
    return (
      <div className="app-loading">
        <div className="app-loading-spinner" />
        <p>Loading SecretDiary…</p>
      </div>
    );
  }

  if (!user) {
    return <LandingPage />;
  }
  // ──────────────────────────────────────────────────────────

  const handlePost = async (newConfession) => {
    try {
      if (editingConfession) {
        // Update existing
        await confessionService.update(editingConfession._id, {
          text: newConfession.content,
          category: newConfession.category,
          hashtags: newConfession.hashtags,
          secretCode: newConfession.secretCode, // The code to set (new or same)
          currentSecretCode: newConfession.secretCode // The code for verification
        });
      } else {
        // Create new
        await confessionService.create({
          text: newConfession.content,
          category: newConfession.category,
          hashtags: newConfession.hashtags,
          secretCode: newConfession.secretCode
        });
      }

      // Trigger refresh
      setRefreshKey(prev => prev + 1);
      setIsModalOpen(false);
      setEditingConfession(null);
    } catch (err) {
      console.error("Failed to post/update confession:", err);
      throw err; // Re-throw to show in Modal error state
    }
  };

  const handleReact = async (id, type) => {
    try {
      await confessionService.react(id, type);
      // Optimistic update or refresh? Let's refresh for consistency with real data
      setRefreshKey(prev => prev + 1);
    } catch (err) {
      console.error("Failed to react:", err);
    }
  };

  const categories = ['All', 'General', 'Study', 'Crush', 'Funny', 'Rant'];

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
            searchQuery={searchQuery}
          />
        );
      case 'profile':
        return (
          <ProfilePage
            onRefresh={() => setRefreshKey(prev => prev + 1)}
            onEdit={(confession) => {
              setEditingConfession(confession);
              setIsModalOpen(true);
            }}
          />
        );
      case 'trends': return <TrendsPage />;
      case 'chats': return <ChatsPage />;
      default: return null;
    }
  };

  return (
    <div className="app-root">
      {/* Sticky Navbar */}
      <Navbar
        onConfessClick={() => setIsModalOpen(true)}
        searchQuery={searchQuery}
        onSearch={setSearchQuery}
        activeTab={activeTab}
      />

      <div className="app-body">
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onCreateClick={() => setIsModalOpen(true)}
        />

        <main className={`main-content-area ${activeTab === 'chats' ? 'chats-mode' : ''}`}>
          {renderContent()}
        </main>
      </div>

      <CreateModal
        isOpen={isModalOpen}
        editingData={editingConfession}
        onClose={() => {
          setIsModalOpen(false);
          setEditingConfession(null);
        }}
        onPost={handlePost}
      />
    </div>
  );
};

export default App;

