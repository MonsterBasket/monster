import React from 'react';

const UpcomingGameAd = () => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    background: '#181a1b',
    color: '#fff',
    fontFamily: 'Arial, sans-serif'
  }}>
    <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Monster Quest</h1>
    <p style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>
      An epic adventure awaits. Embark on your journey to become the ultimate monster tamer!
    </p>
    <button style={{
      padding: '1rem 2rem',
      fontSize: '1.2rem',
      background: '#ff9800',
      color: '#fff',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer'
    }}>
      Coming Soon
    </button>
  </div>
);

export default UpcomingGameAd;