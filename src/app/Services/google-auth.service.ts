import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

export interface GoogleAuthConfig {
  clientId: string;
  scopes?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class GoogleAuthService {
  private config: GoogleAuthConfig = {
    clientId: environment.googleAuth.clientId,
    scopes: ['email', 'profile']
  };

  constructor() { }

  getConfig(): GoogleAuthConfig {
    return this.config;
  }

  setClientId(clientId: string): void {
    this.config.clientId = clientId;
  }

  isConfigured(): boolean {
    return !!this.config.clientId && this.config.clientId.length > 0;
  }
}
