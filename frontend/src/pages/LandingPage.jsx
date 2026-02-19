import React, { useState } from 'react';
import { Sparkles, Shield, Users, TrendingUp, MessageCircle, Lock } from 'lucide-react';
import LoginSignup from '../components/LoginSignup';
import './LandingPage.css';

const LandingPage = () => {
    const [isAuthOpen, setIsAuthOpen] = useState(false);
    const [authMode, setAuthMode] = useState('login'); // unused in new modal but kept for clarity

    const openLogin = () => { setAuthMode('login'); setIsAuthOpen(true); };
    const openSignup = () => { setAuthMode('signup'); setIsAuthOpen(true); };

    const features = [
        { icon: <Shield size={22} />, title: 'Fully Anonymous', desc: 'Your identity is always protected. No real names, ever.' },
        { icon: <Users size={22} />, title: 'Campus Community', desc: 'Connect with real students from your campus.' },
        { icon: <TrendingUp size={22} />, title: 'Trending Secrets', desc: 'Discover what\'s buzzing around your campus right now.' },
        { icon: <MessageCircle size={22} />, title: 'Real Reactions', desc: 'Like, comment and share secrets that resonate with you.' },
    ];

    return (
        <div className="landing-root">
            {/* ── Navbar ── */}
            <header className="landing-nav">
                <div className="landing-nav-brand">
                    <div className="landing-brand-icon"><Sparkles size={18} /></div>
                    <span>WhisperWall</span>
                </div>
                <div className="landing-nav-actions">
                    <button className="land-btn-outline" onClick={openLogin}>Log In</button>
                    <button className="land-btn-solid" onClick={openSignup}>Sign Up Free</button>
                </div>
            </header>

            {/* ── Hero ── */}
            <section className="landing-hero">
                {/* Decorative blobs */}
                <div className="land-blob land-blob-a" />
                <div className="land-blob land-blob-b" />
                <div className="land-blob land-blob-c" />

                <div className="hero-content">
                    <div className="hero-badge">
                        <Lock size={13} />
                        <span>100% Anonymous · Campus Only</span>
                    </div>

                    <h1 className="hero-title">
                        Your Campus.<br />
                        <span className="hero-gradient">Your Secrets.</span><br />
                        Your Safe Space.
                    </h1>

                    <p className="hero-subtitle">
                        Share confessions, crushes, rants, and laughs anonymously
                        with your campus community — completely safe and judgment-free.
                    </p>

                    <div className="hero-ctas">
                        <button className="land-btn-solid hero-cta-primary" onClick={openSignup}>
                            <Sparkles size={17} />
                            Get Started — It's Free
                        </button>
                        <button className="land-btn-ghost" onClick={openLogin}>
                            Already have an account? Sign in →
                        </button>
                    </div>

                    {/* Floating preview card */}
                    <div className="hero-preview">
                        <div className="preview-card">
                            <div className="preview-card-header">
                                <div className="preview-avatar">A</div>
                                <div>
                                    <p className="preview-name">Anon #4291</p>
                                    <p className="preview-time">Just now</p>
                                </div>
                                <span className="preview-tag crush">Crush</span>
                            </div>
                            <p className="preview-text">
                                To the person who always saves me a seat in the 9 AM lecture —
                                I look forward to it every single day 🥺
                            </p>
                            <div className="preview-footer">
                                <span>❤️ 128</span>
                                <span>💬 34</span>
                                <span>#crush #campus</span>
                            </div>
                        </div>

                        <div className="preview-card preview-card-2">
                            <div className="preview-card-header">
                                <div className="preview-avatar study">S</div>
                                <div>
                                    <p className="preview-name">Anon #7823</p>
                                    <p className="preview-time">5m ago</p>
                                </div>
                                <span className="preview-tag study">Study</span>
                            </div>
                            <p className="preview-text">
                                I've been studying the wrong syllabus for 3 weeks 😭 finals are next week
                            </p>
                            <div className="preview-footer">
                                <span>❤️ 94</span>
                                <span>💬 21</span>
                                <span>#fail #help</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Features ── */}
            <section className="landing-features">
                <h2 className="features-title">Why WhisperWall?</h2>
                <p className="features-subtitle">Everything you need to share freely and safely.</p>
                <div className="features-grid">
                    {features.map((f, i) => (
                        <div className="feature-card" key={i}>
                            <div className="feature-icon">{f.icon}</div>
                            <h3>{f.title}</h3>
                            <p>{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── CTA Banner ── */}
            <section className="landing-cta-banner">
                <div className="land-blob land-blob-d" />
                <h2>Ready to whisper your secret?</h2>
                <p>Join thousands of students sharing anonymously. No sign of your real identity — ever.</p>
                <button className="land-btn-solid cta-big" onClick={openSignup}>
                    Create Free Account
                </button>
            </section>

            {/* ── Footer ── */}
            <footer className="landing-footer">
                <span>© 2024 WhisperWall · Anonymous Campus Confessions</span>
            </footer>

            {/* Auth Modal */}
            <LoginSignup isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
        </div>
    );
};

export default LandingPage;
