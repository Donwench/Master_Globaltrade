import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'your-refresh-secret-change-this';

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  companyId?: string;
  iat?: number;
  exp?: number;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

/**
 * Generate access token (15 minutes expiry)
 */
export function generateAccessToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '15m',
    algorithm: 'HS256',
  });
}

/**
 * Generate refresh token (7 days expiry)
 */
export function generateRefreshToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
  return jwt.sign(payload, REFRESH_SECRET, {
    expiresIn: '7d',
    algorithm: 'HS256',
  });
}

/**
 * Generate both access and refresh tokens
 */
export function generateTokenPair(payload: Omit<JWTPayload, 'iat' | 'exp'>): TokenPair {
  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload),
  };
}

/**
 * Verify access token
 */
export function verifyAccessToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET, {
      algorithms: ['HS256'],
    }) as JWTPayload;
  } catch (error) {
    return null;
  }
}

/**
 * Verify refresh token
 */
export function verifyRefreshToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, REFRESH_SECRET, {
      algorithms: ['HS256'],
    }) as JWTPayload;
  } catch (error) {
    return null;
  }
}

/**
 * Decode token without verification (for inspection)
 */
export function decodeToken(token: string): JWTPayload | null {
  try {
    return jwt.decode(token) as JWTPayload | null;
  } catch (error) {
    return null;
  }
}
