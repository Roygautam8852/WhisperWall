import React, { useState } from 'react';
import './ProfilePage.css';

const ProfilePage = () => {
    const [activeTab, setActiveTab] = useState('My Posts');
    const [savedCount, setSavedCount] = useState(12);

    return (
        <div className="profile-container">
            <div className="profile-header card">
                <div className="avatar-placeholder">You</div>
                <div className="profile-info">
                    <h2>My Safe Space</h2>
                    <p className="text-secondary">Anonymous Contributor</p>
                    <div className="profile-stats">
                        <div className="stat">
                            <span className="count">42</span>
                            <span className="label">Secrets</span>
                        </div>
                        <div className="stat">
                            <span className="count">1.5k</span>
                            <span className="label">Hearts Rec</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="tabs-container">
                {['My Posts', 'Drafts', 'Saved'].map(tab => (
                    <button
                        key={tab}
                        className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className="profile-content">
                {activeTab === 'My Posts' && (
                    <div className="card post-item">
                        <div className="post-meta">
                            <span className="tag study">Study</span>
                            <span className="date">2 days ago</span>
                            <span className="status active">Active</span>
                        </div>
                        <p>Finally finished my thesis! The relief is unreal.</p>
                        <div className="post-actions">
                            <button>Edit</button>
                            <button className="text-danger">Delete</button>
                        </div>
                    </div>
                )}
                {activeTab === 'Drafts' && (
                    <div className="card post-item draft">
                        <p>Draft: Something about the cafeteria food...</p>
                        <button className="btn-resume">Resume Editing</button>
                    </div>
                )}
                {activeTab === 'Saved' && (
                    <div className="empty-state">No saved posts yet.</div>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;
