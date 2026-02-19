import React from 'react';
import './TrendsPage.css';

const TrendsPage = () => {
    return (
        <div className="trends-container">
            <h1>Campus Pulse 📊</h1>
            <p className="subtitle">Real-time insights from across campus</p>

            <div className="stats-grid">
                <div className="card stat-card">
                    <h3>2,451</h3>
                    <p>Total Confessions</p>
                </div>
                <div className="card stat-card">
                    <h3>15.2k</h3>
                    <p>Hearts Given 💜</p>
                </div>
                <div className="card stat-card">
                    <h3>42</h3>
                    <p>Campuses Online</p>
                </div>
            </div>

            <div className="charts-section">
                <div className="card chart-card">
                    <h3>Peak Activity Hours 🕒</h3>
                    <div className="bar-chart">
                        <div className="bar" style={{ height: '30%' }} title="8 AM"></div>
                        <div className="bar" style={{ height: '50%' }} title="12 PM"></div>
                        <div className="bar" style={{ height: '80%' }} title="4 PM"></div>
                        <div className="bar" style={{ height: '95%' }} title="8 PM"></div>
                        <div className="bar" style={{ height: '60%' }} title="12 AM"></div>
                    </div>
                </div>

                <div className="card chart-card">
                    <h3>Weekly Mood ☁️</h3>
                    <div className="word-cloud">
                        <span style={{ fontSize: '2rem', color: '#6366f1' }}>Stressed</span>
                        <span style={{ fontSize: '1.5rem', color: '#ec4899' }}>Excited</span>
                        <span style={{ fontSize: '1rem', color: '#10b981' }}>Coffee</span>
                        <span style={{ fontSize: '1.2rem', color: '#f59e0b' }}>Exams</span>
                        <span style={{ fontSize: '0.9rem', color: '#64748b' }}>Sleep</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrendsPage;
