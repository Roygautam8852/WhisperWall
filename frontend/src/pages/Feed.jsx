import React, { useState } from 'react';
import ConfessionCard from '../components/ConfessionCard';
import './Feed.css';

const Feed = ({ confessions, onReact, categories, activeCategory, onCategoryChange, onSortChange, sortOption }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredConfessions = confessions
        .filter(c => activeCategory === 'All' || c.category === activeCategory)
        .filter(c => c.content.toLowerCase().includes(searchTerm.toLowerCase()) || c.hashtags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
        .sort((a, b) => {
            if (sortOption === 'Newest') return new Date(b.timestamp) - new Date(a.timestamp);
            return new Date(a.timestamp) - new Date(b.timestamp);
        });

    return (
        <div className="feed-container">
            {/* Header Actions */}
            <div className="feed-header card">
                <div className="filter-row">
                    <div className="tabs">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                className={`citation ${activeCategory === cat ? 'active' : ''}`}
                                onClick={() => onCategoryChange(cat)}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    <div className="sort-dropdown">
                        <select value={sortOption} onChange={(e) => onSortChange(e.target.value)}>
                            <option value="Newest">Newest First</option>
                            <option value="Oldest">Oldest First</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Feed List */}
            <div className="feed-list">
                {filteredConfessions.length > 0 ? (
                    filteredConfessions.map(confession => (
                        <ConfessionCard
                            key={confession.id}
                            data={confession}
                            onReact={onReact}
                        />
                    ))
                ) : (
                    <div className="empty-state">
                        <h3>No secrets found 🕵️‍♂️</h3>
                        <p>Try adjusting your filters or search terms.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Feed;
