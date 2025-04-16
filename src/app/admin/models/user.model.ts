export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'editor';
  token?: string;
  firstName?: string;
  lastName?: string;
  lastLogin?: Date;
  expiryTime: number;  // Unix timestamp for session expiry
}

export interface UserCredentials {
  email: string;
  password: string;
}
