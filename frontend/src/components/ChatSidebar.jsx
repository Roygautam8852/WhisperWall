import React from 'react';
import './ChatSidebar.css';

const ChatSidebar = ({ contacts, selectedId, onSelect }) => {
    return (
        <aside className="chat-sidebar">
            {/* Header */}
            <div className="chat-sidebar-header">
                <h2>Chats</h2>
                <span className="chat-count">{contacts.length}</span>
            </div>

            {/* Search */}
            <div className="chat-search-bar">
                <span className="search-icon">🔍</span>
                <input
                    type="text"
                    placeholder="Search chats..."
                    className="chat-search-input"
                />
            </div>

            {/* Contact List */}
            <div className="contact-list">
                {contacts.map((contact) => (
                    <div
                        key={contact.id}
                        className={`contact-item ${selectedId === contact.id ? 'active' : ''}`}
                        onClick={() => onSelect(contact)}
                    >
                        {/* Avatar with online indicator */}
                        <div className="contact-avatar-wrap">
                            <img
                                src={contact.avatar}
                                alt={contact.name}
                                className="contact-avatar"
                                onError={(e) => { e.target.src = `https://api.dicebear.com/7.x/thumbs/svg?seed=${contact.id}`; }}
                            />
                            {contact.online && <span className="online-dot" />}
                        </div>

                        {/* Info */}
                        <div className="contact-info">
                            <div className="contact-top">
                                <span className="contact-name">{contact.name}</span>
                                <span className="contact-time">{contact.timestamp}</span>
                            </div>
                            <p className="contact-last-msg">{contact.lastMessage}</p>
                        </div>
                    </div>
                ))}
            </div>
        </aside>
    );
};

export default ChatSidebar;
