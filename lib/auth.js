import jwt from 'jsonwebtoken';

/**
 * Verify JWT token from request header
 * @param {Request} request - Next.js request object
 * @returns {object|null} - Decoded token or null if invalid
 */
export function verifyToken(request) {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader) {
    return null;
  }
  
  const token = authHeader.replace('Bearer ', '');
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    return null;
  }
}

/**
 * Optional: Create token for testing purposes
 * @param {object} payload - Data to encode in token
 * @returns {string} - JWT token string
 */
export function createToken(payload) {
  return jwt.sign(
    payload,
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
}