// Intelligent API configuration for Iqama Hotel Booking
// Automatically connects to Render deployment, custom domain, or local development.
window.API_BASE_URL = (() => {
  // If explicitly defined beforehand or through environment
  if (window.CUSTOM_API_BASE_URL) {
    return window.CUSTOM_API_BASE_URL;
  }

  if (typeof window !== 'undefined' && window.location && window.location.origin && window.location.origin !== 'null' && !window.location.origin.startsWith('file:')) {
    // Local static server (serve, Live Server, etc.)
    if (['3000', '5000', '5500'].includes(window.location.port)) {
      return 'http://127.0.0.1:8000/api';
    }
    // Production (Render, etc.) or same origin
    return `${window.location.origin.replace(/\/+$/, '')}/api`;
  }

  return 'http://127.0.0.1:8000/api';
})();
