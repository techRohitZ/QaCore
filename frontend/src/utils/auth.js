/**
 * PROFESSIONAL AUTH UTILITIES
 * Handles secure storage and retrieval of JWT tokens.
 */

const TOKEN_KEY = "token"; // Centralized key to prevent typos

/**
 * Persists the JWT token to local storage.
 * @param {string} token - The raw JWT string from the backend.
 */
export const setAuth = (token) => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  }
};

/**
 * Retrieves the stored token.
 * Useful for initializing Axios headers or checking login status.
 */
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * Checks if the user is logged in.
 * Professional Tip: Returns a boolean instead of the raw string.
 */
export const isAuthenticated = () => {
  const token = getToken();
  return !!token; // Returns true if token exists, false otherwise
};

/**
 * Clears the session and redirects to prevent stale data.
 */
export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
  window.location.href = "/login"; // Forces a clean state for the next user
};

// export const setAuth =(token) =>{
//     localStorage.setItem("token",token);

// };

// export function getToken() {
//   return localStorage.getItem("token");
// ;}

// export const isAuthenticated =()=>{
//     return localStorage.getItem("token");

// };

// export const logout =()=>{
//     localStorage.removeItem("token");
// };
