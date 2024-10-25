/**
 * Middleware to authorize users based on role.
 * @param {Array} allowedRoles - List of roles that can access the route.
 * @returns {Function} - Hapi.js pre-handler function.
 */
const authorize = (allowedRoles) => {
  return (request, h) => {
    const userType = request.auth.credentials.userType; // Get user's role from JWT

    // Check if user type is in the list of allowed roles
    if (!allowedRoles.includes(userType)) {
      return h.response({ message: 'Forbidden' }).code(403).takeover();
    }

    return h.continue; // Allow access if the user type matches
  };
};

module.exports = { authorize };
