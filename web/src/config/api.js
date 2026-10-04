// Centralized API Base URL configuration for local dev and production deployment
const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || 'https://gform-six.vercel.app/api';

// Normalize URL by removing trailing slash if present
export const API_BASE_URL = rawBaseUrl.replace(/\/+$/, '');
