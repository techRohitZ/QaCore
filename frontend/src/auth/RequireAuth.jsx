import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated } from '../utils/auth';

/**
 * Higher-Order Component to protect private routes.
 * Redirects to /login if the user is not authenticated.
 */
export default function RequireAuth({ children }) {
  const location = useLocation();

  if (!isAuthenticated()) {
    // Redirect to login but save the current location to redirect back after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}