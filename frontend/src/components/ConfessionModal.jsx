import React, { useState, useEffect, useContext } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import './ConfessionModal.css';

const ConfessionModal = ({ isOpen, onClose, onSubmit, editingConfession }) => {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    text: '',
    secretCode: '',
    currentSecretCode: '',
    category: 'General',
    hashtags: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingConfession) {
      setFormData({
        text: editingConfession.text,
        secretCode: '',
        currentSecretCode: '',
        category: editingConfession.category || 'General',
        hashtags: editingConfession.hashtags?.join(' ') || '',
      });
    } else {
      setFormData({
        text: '',
        secretCode: '',
        currentSecretCode: '',
        category: 'General',
        hashtags: '',
      });
    }
    setError('');
  }, [editingConfession, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!user) {
      setError('Please login first');
      return;
    }

    if (formData.text.trim().length < 10) {
      setError('Confession must be at least 10 characters');
      return;
    }

    if (editingConfession && !formData.currentSecretCode) {
      setError('Please enter current secret code to edit');
      return;
    }

    if (!editingConfession && formData.secretCode.length < 4) {
      setError('Secret code must be at least 4 characters');
      return;
    }

    if (editingConfession && formData.secretCode.length < 4) {
      setError('New secret code must be at least 4 characters');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        text: formData.text.trim(),
        category: formData.category,
        hashtags: formData.hashtags
          .trim()
          .toLowerCase()
          .split(/\s+/)
          .filter((tag) => tag.length > 0),
      };

      if (editingConfession) {
        payload.secretCode = formData.secretCode;
        payload.currentSecretCode = formData.currentSecretCode;
      } else {
        payload.secretCode = formData.secretCode;
      }

      await onSubmit(payload, editingConfession?._id);
      setFormData({
        text: '',
        secretCode: '',
        currentSecretCode: '',
        category: 'General',
        hashtags: '',
      });
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          >
            <motion.div
              className="modal-container"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h2>{editingConfession ? 'Edit Confession' : 'Share Your Secret'}</h2>
                <button className="modal-close" onClick={onClose}>
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="modal-form">
                <div className="form-group">
                  <label htmlFor="text">Your Confession *</label>
                  <textarea
                    id="text"
                    name="text"
                    value={formData.text}
                    onChange={handleChange}
                    placeholder="Share your thoughts, feelings, or secrets... (minimum 10 characters)"
                    rows="5"
                    maxLength="2000"
                  />
                  <div className="char-count">
                    {formData.text.length}/2000
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="category">Category</label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                    >
                      <option value="General">General</option>
                      <option value="Crush">Crush</option>
                      <option value="Study">Study</option>
                      <option value="Funny">Funny</option>
                      <option value="Rant">Rant</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="hashtags">Hashtags (space-separated)</label>
                    <input
                      id="hashtags"
                      name="hashtags"
                      type="text"
                      value={formData.hashtags}
                      onChange={handleChange}
                      placeholder="e.g. love heartbreak emotions"
                    />
                  </div>
                </div>

                {editingConfession ? (
                  <>
                    <div className="form-group">
                      <label htmlFor="currentSecretCode">Current Secret Code *</label>
                      <input
                        id="currentSecretCode"
                        name="currentSecretCode"
                        type="password"
                        value={formData.currentSecretCode}
                        onChange={handleChange}
                        placeholder="Enter current secret code to edit"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="secretCode">New Secret Code (optional)</label>
                      <input
                        id="secretCode"
                        name="secretCode"
                        type="password"
                        value={formData.secretCode}
                        onChange={handleChange}
                        placeholder="Leave blank to keep same code"
                      />
                      <small>If you want to update your secret code</small>
                    </div>
                  </>
                ) : (
                  <div className="form-group">
                    <label htmlFor="secretCode">
                      Secret Code (to edit/delete later) *
                    </label>
                    <input
                      id="secretCode"
                      name="secretCode"
                      type="password"
                      value={formData.secretCode}
                      onChange={handleChange}
                      placeholder="Min. 4 characters (e.g., 1234 or mySecret)"
                    />
                    <small>You'll need this to edit or delete your confession</small>
                  </div>
                )}

                {error && <div className="error-message">{error}</div>}

                <div className="form-actions">
                  <button
                    type="button"
                    className="btn-cancel"
                    onClick={onClose}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <motion.button
                    type="submit"
                    className="btn-submit"
                    disabled={loading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {loading
                      ? 'Posting...'
                      : editingConfession
                        ? 'Update Confession'
                        : 'Post Confession'}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ConfessionModal;
