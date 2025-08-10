import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

export interface UnauthorizedConfig {
  title?: string;
  message?: string;
  showContactAdmin?: boolean;
  showGoBack?: boolean;
  showGoHome?: boolean;
  contactEmail?: string;
  redirectPath?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UnauthorizedService {
  private showUnauthorizedSubject = new BehaviorSubject<boolean>(false);
  private configSubject = new BehaviorSubject<UnauthorizedConfig>({});

  public showUnauthorized$ = this.showUnauthorizedSubject.asObservable();
  public config$ = this.configSubject.asObservable();

  constructor(private router: Router) {}

  /**
   * Show unauthorized access modal/component
   * @param config Configuration for the unauthorized component
   */
  showUnauthorizedAccess(config: UnauthorizedConfig = {}): void {
    const defaultConfig: UnauthorizedConfig = {
      title: 'Access Denied',
      message: 'You do not have permission to perform this action.',
      showContactAdmin: true,
      showGoBack: true,
      showGoHome: true,
      contactEmail: 'admin@example.com'
    };

    this.configSubject.next({ ...defaultConfig, ...config });
    this.showUnauthorizedSubject.next(true);
  }

  /**
   * Hide unauthorized access modal/component
   */
  hideUnauthorizedAccess(): void {
    this.showUnauthorizedSubject.next(false);
  }

  /**
   * Navigate to unauthorized page
   * @param config Configuration for the unauthorized page
   */
  navigateToUnauthorizedPage(config: UnauthorizedConfig = {}): void {
    // Store config in session storage for the unauthorized page to use
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('unauthorizedConfig', JSON.stringify(config));
    }
    this.router.navigate(['/unauthorized']);
  }

  /**
   * Get stored config from session storage
   */
  getStoredConfig(): UnauthorizedConfig | null {
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('unauthorizedConfig');
      if (stored) {
        sessionStorage.removeItem('unauthorizedConfig');
        return JSON.parse(stored);
      }
    }
    return null;
  }

  /**
   * Check if user has specific permission
   * @param permission Permission to check
   * @param userRole Current user role
   * @returns Boolean indicating if user has permission
   */
  hasPermission(permission: string, userRole: string): boolean {
    // Define permission matrix
    const permissions: { [key: string]: string[] } = {
      'CREATE_DOCUMENT': ['ADMIN', 'USER'],
      'DELETE_DOCUMENT': ['ADMIN', 'USER'], // User can delete their own
      'ADMIN_DASHBOARD': ['ADMIN'],
      'MANAGE_USERS': ['ADMIN'],
      'VIEW_ALL_DOCUMENTS': ['ADMIN'],
      'ARCHIVE_DOCUMENT': ['ADMIN', 'USER'],
      'SHARE_DOCUMENT': ['ADMIN', 'USER'],
      'CREATE_WORKSPACE': ['ADMIN', 'USER'],
      'DELETE_WORKSPACE': ['ADMIN'],
      'MANAGE_WORKSPACE': ['ADMIN', 'USER']
    };

    return permissions[permission]?.includes(userRole) || false;
  }

  /**
   * Check permission and show unauthorized if not allowed
   * @param permission Permission to check
   * @param userRole Current user role
   * @param config Optional config for unauthorized display
   * @returns Boolean indicating if action should proceed
   */
  checkPermissionOrShowUnauthorized(
    permission: string, 
    userRole: string, 
    config?: UnauthorizedConfig
  ): boolean {
    if (!this.hasPermission(permission, userRole)) {
      const unauthorizedConfig = {
        title: 'Insufficient Permissions',
        message: `You need ${permission.replace('_', ' ').toLowerCase()} permission to perform this action.`,
        ...config
      };
      this.showUnauthorizedAccess(unauthorizedConfig);
      return false;
    }
    return true;
  }
}
