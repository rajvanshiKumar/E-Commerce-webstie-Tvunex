// Core of the mock API layer.
//
// Every "endpoint" in src/api/* resolves through mockRequest(), which adds a
// small artificial delay and returns a deep copy of the data — exactly how a
// real network response behaves (async, and never the same object reference).
// To move to a real backend, replace the bodies of the functions in
// authApi.js / productApi.js / categoryApi.js with fetch() calls. Components
// and hooks do not need to change.

import banners from '../data/banners';
import reviews from '../data/reviews';
import { STORAGE_KEYS, getItem, setItem } from '../utils/localStorage';
import { isValidEmail } from '../utils/validators';

export const NETWORK_DELAY = 650;

export class ApiError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

const clone = (value) => (value === undefined ? value : JSON.parse(JSON.stringify(value)));

/**
 * Simulates a network request.
 * @param {() => any} resolver  Function that produces the response (may throw ApiError).
 * @param {{ delay?: number }} options
 */
export function mockRequest(resolver, { delay = NETWORK_DELAY } = {}) {
  return new Promise((resolve, reject) => {
    window.setTimeout(() => {
      try {
        resolve(clone(resolver()));
      } catch (error) {
        reject(error);
      }
    }, delay);
  });
}

/* ---------- content endpoints ---------- */

export function getBanners() {
  return mockRequest(() => banners);
}

export function getReviews() {
  return mockRequest(() => reviews);
}

export function subscribeToNewsletter(email) {
  return mockRequest(
    () => {
      const value = String(email).trim().toLowerCase();
      if (!isValidEmail(value)) throw new ApiError('Enter a valid email address.', 422);
      const subscribers = getItem(STORAGE_KEYS.NEWSLETTER, []);
      if (!subscribers.includes(value)) setItem(STORAGE_KEYS.NEWSLETTER, [...subscribers, value]);
      return { email: value, subscribed: true };
    },
    { delay: 500 },
  );
}
