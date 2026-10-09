// Safe wrappers around window.localStorage. Every read/write in the app goes
// through here so a blocked or full storage never crashes the UI.

export const STORAGE_KEYS = {
  USERS: 'users',
  CURRENT_USER: 'currentUser',
  CART: 'praharx_cart',
  WISHLIST: 'praharx_wishlist',
  RECENT_SEARCHES: 'praharx_recent_searches',
  NEWSLETTER: 'praharx_newsletter',
};

export function getItem(key, fallback = null) {
  try {
    const raw = window.localStorage.getItem(key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function setItem(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function removeItem(key) {
  try {
    window.localStorage.removeItem(key);
  } catch {
    /* storage unavailable — nothing to remove */
  }
}
