export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'editor';
  token?: string;
  firstName?: string;
  lastName?: string;
  lastLogin?: Date;
}

export interface UserCredentials {
  email: string;
  password: string;
}
