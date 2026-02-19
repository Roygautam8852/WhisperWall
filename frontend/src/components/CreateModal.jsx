import React, { useState } from 'react';
import './CreateModal.css';

const Modal = ({ isOpen, onClose, onPost }) => {
    if (!isOpen) return null;

    const [content, setContent] = useState('');
    const [category, setCategory] = useState('Study');
    const [isAnonymous, setIsAnonymous] = useState(true);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!content.trim()) return;

        onPost({
            content,
            category,
            isAnonymous,
            hashtags: ['#secret'], // simplistic hashtag logic
            author: isAnonymous ? `Anon #${Math.floor(Math.random() * 9000) + 1000}` : 'You',
        });

        // Reset
        setContent('');
        setCategory('Study');
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Share a Secret 🤫</h2>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>

                <form onSubmit={handleSubmit}>
                    <textarea
                        placeholder="Type your confession here... (Be kind!)"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        maxLength={280}
                        required
                    />

                    <div className="char-count">{content.length}/280</div>

                    <div className="form-options">
                        <div className="option-group">
                            <label>Vibe:</label>
                            <select value={category} onChange={e => setCategory(e.target.value)}>
                                <option value="Study">📚 Study</option>
                                <option value="Crush">😍 Crush</option>
                                <option value="Funny">😂 Funny</option>
                                <option value="Rant">😤 Rant</option>
                            </select>
                        </div>

                        <div className="option-group toggle">
                            <label>
                                <input
                                    type="checkbox"
                                    checked={isAnonymous}
                                    onChange={e => setIsAnonymous(e.target.checked)}
                                />
                                Post Anonymously
                            </label>
                        </div>
                    </div>

                    <button type="submit" className="post-btn">
                        Publish Secret
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Modal;
