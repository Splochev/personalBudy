// Shared utilities for the personalBudy app cluster.
// Import via: import { generateId, debounce, friendlyAuthError } from 'https://splochev.github.io/personalBudy/js/shared-utils.js';

/**
 * Generates a short random ID.
 */
export function generateId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

/**
 * Returns a debounced version of fn that fires after `delay` ms of inactivity.
 */
export function debounce(fn, delay = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

/**
 * Maps a Firebase Auth error code to a human-readable message.
 * @param {string} code - e.g. "auth/wrong-password"
 * @param {function} t - translation function, e.g. (key) => translations[lang][key]
 */
export function friendlyAuthError(code, t) {
  const map = {
    'auth/user-not-found':        t('error_user_not_found'),
    'auth/wrong-password':        t('error_wrong_password'),
    'auth/invalid-credential':    t('error_invalid_credential'),
    'auth/too-many-requests':     t('error_too_many_requests'),
    'auth/network-request-failed':t('error_network'),
    'auth/email-already-in-use':  t('error_email_in_use'),
  };
  return map[code] ?? t('error_generic');
}
