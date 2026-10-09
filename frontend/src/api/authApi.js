// Frontend-only authentication. "users" and "currentUser" live in localStorage.
// There is no server: this is a demo of the flow, not real security.

import seedUsers from '../data/users';
import { STORAGE_KEYS, getItem, removeItem, setItem } from '../utils/localStorage';
import { ApiError, mockRequest } from './mockApi';

function readUsers() {
  const stored = getItem(STORAGE_KEYS.USERS);
  if (Array.isArray(stored)) return stored;
  setItem(STORAGE_KEYS.USERS, seedUsers);
  return seedUsers;
}

// Never keep the password in the session object.
const toSessionUser = ({ password: _password, ...user }) => user;

const normaliseEmail = (email) => String(email).trim().toLowerCase();

export function registerUser({ name, email, password }) {
  return mockRequest(() => {
    const users = readUsers();
    const cleanEmail = normaliseEmail(email);

    if (users.some((user) => user.email === cleanEmail)) {
      throw new ApiError('An account with this email already exists.', 409);
    }

    const user = {
      id: users.reduce((max, item) => Math.max(max, item.id), 0) + 1,
      name: name.trim(),
      email: cleanEmail,
      password,
      createdAt: new Date().toISOString(),
    };

    setItem(STORAGE_KEYS.USERS, [...users, user]);
    const sessionUser = toSessionUser(user);
    setItem(STORAGE_KEYS.CURRENT_USER, sessionUser);
    return sessionUser;
  });
}

export function loginUser(email, password) {
  return mockRequest(() => {
    const cleanEmail = normaliseEmail(email);
    const user = readUsers().find((item) => item.email === cleanEmail && item.password === password);
    if (!user) throw new ApiError('Invalid email or password.', 401);

    const sessionUser = toSessionUser(user);
    setItem(STORAGE_KEYS.CURRENT_USER, sessionUser);
    return sessionUser;
  });
}

export function logoutUser() {
  return mockRequest(
    () => {
      removeItem(STORAGE_KEYS.CURRENT_USER);
      return { success: true };
    },
    { delay: 150 },
  );
}

/** Synchronous session restore used when the app boots. */
export function getCurrentUser() {
  return getItem(STORAGE_KEYS.CURRENT_USER, null);
}
