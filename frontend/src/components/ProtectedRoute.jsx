import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

/**
 * ProtectedRoute - Wrapper component for routes that require authentication
 * If user is not authenticated, redirects to home page
 * If still loading auth state, shows loading state
 */
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="loading-container" style={loadingStyle}>
        <div className="loader" style={loaderStyle}>
          <div style={spinnerStyle}></div>
        </div>
        <p style={textStyle}>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const loadingStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  gap: '1rem',
};

const loaderStyle = {
  width: '50px',
  height: '50px',
};

const spinnerStyle = {
  width: '100%',
  height: '100%',
  border: '4px solid var(--light-dark)',
  borderTop: '4px solid var(--primary)',
  borderRadius: '50%',
  animation: 'spin 1s linear infinite',
};

const textStyle = {
  fontSize: '1.1rem',
  fontWeight: '500',
  color: 'var(--text-light)',
};

export default ProtectedRoute;
