export interface Login {
  email?: string;
  password?: string;
  googleToken?: string;
  provider?: 'email' | 'google';
}

export interface GoogleLoginResponse {
  credential: string;
  select_by: string;
}

export interface CustomJwtPayload {
  email: string;
  name: string;
  id: string;
  role: string;
  exp: number;
  aud: string;
  iss: string;
}
