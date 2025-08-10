// Example 1: Using in a document component with permission checking
import { Component } from '@angular/core';
import { UnauthorizedService } from '../Services/unauthorized/unauthorized.service';
import { AuthService } from '../Services/Auth/auth.service';

@Component({
  selector: 'app-document-example',
  template: `
    <div class="document-actions">
      <button (click)="deleteDocument()" class="btn-danger">
        Delete Document
      </button>
      <button (click)="editDocument()" class="btn-primary">
        Edit Document
      </button>
      <button (click)="shareDocument()" class="btn-secondary">
        Share Document
      </button>
    </div>
    
    <!-- Add unauthorized modal to your template -->
    <app-unauthorized-modal></app-unauthorized-modal>
  `
})
export class DocumentExampleComponent {
  userRole: string = '';

  constructor(
    private unauthorizedService: UnauthorizedService,
    private authService: AuthService
  ) {
    // Get user role
    this.authService.role.subscribe(role => {
      this.userRole = role;
    });
  }

  deleteDocument(): void {
    // Check permission before allowing action
    const canDelete = this.unauthorizedService.checkPermissionOrShowUnauthorized(
      'DELETE_DOCUMENT',
      this.userRole,
      {
        title: 'Delete Permission Required',
        message: 'You need delete permissions to remove this document.',
        showContactAdmin: true,
        contactEmail: 'admin@company.com'
      }
    );

    if (canDelete) {
      // Proceed with deletion
      this.performDelete();
    }
  }

  editDocument(): void {
    // Simple permission check
    if (!this.unauthorizedService.hasPermission('EDIT_DOCUMENT', this.userRole)) {
      this.unauthorizedService.showUnauthorizedAccess({
        title: 'Edit Access Denied',
        message: 'This document is read-only for your user level.',
        showGoBack: true,
        showContactAdmin: false
      });
      return;
    }

    // Proceed with editing
    this.performEdit();
  }

  shareDocument(): void {
    // Custom unauthorized message based on business logic
    if (this.userRole === 'GUEST') {
      this.unauthorizedService.showUnauthorizedAccess({
        title: 'Sharing Not Allowed',
        message: 'Guest users cannot share documents. Please upgrade your account or contact an administrator.',
        showContactAdmin: true,
        showGoHome: true,
        contactEmail: 'support@company.com'
      });
      return;
    }

    // Proceed with sharing
    this.performShare();
  }

  private performDelete(): void {
    console.log('Deleting document...');
  }

  private performEdit(): void {
    console.log('Editing document...');
  }

  private performShare(): void {
    console.log('Sharing document...');
  }
}

// Example 2: Using as a guard replacement
export class CustomGuardExample {
  constructor(private unauthorizedService: UnauthorizedService) {}

  canAccessAdminPanel(userRole: string): boolean {
    if (userRole !== 'ADMIN') {
      this.unauthorizedService.navigateToUnauthorizedPage({
        title: 'Administrator Access Required',
        message: 'Only system administrators can access this panel.',
        showContactAdmin: true,
        showGoBack: true,
        showGoHome: true
      });
      return false;
    }
    return true;
  }
}

// Example 3: Using with reactive forms
@Component({
  selector: 'app-form-example',
  template: `
    <form [formGroup]="documentForm" (ngSubmit)="onSubmit()">
      <!-- form fields -->
      <button type="submit" [disabled]="!canSubmit">Submit</button>
    </form>
    <app-unauthorized-modal></app-unauthorized-modal>
  `
})
export class FormExampleComponent {
  canSubmit = true;

  constructor(private unauthorizedService: UnauthorizedService) {}

  onSubmit(): void {
    // Check submission permissions
    const canSubmitForm = this.unauthorizedService.checkPermissionOrShowUnauthorized(
      'CREATE_DOCUMENT',
      this.getCurrentUserRole(),
      {
        title: 'Submission Not Allowed',
        message: 'You do not have permission to create new documents.',
        showContactAdmin: true
      }
    );

    if (!canSubmitForm) {
      return;
    }

    // Process form submission
    this.processForm();
  }

  private getCurrentUserRole(): string {
    // Get current user role logic
    return 'USER';
  }

  private processForm(): void {
    console.log('Processing form...');
  }
}

// Example 4: Using with workspace operations
@Component({
  selector: 'app-workspace-example',
  template: `
    <div class="workspace-actions">
      <button (click)="createWorkspace()">Create Workspace</button>
      <button (click)="deleteWorkspace()">Delete Workspace</button>
      <button (click)="manageWorkspace()">Manage Settings</button>
    </div>
    <app-unauthorized-modal></app-unauthorized-modal>
  `
})
export class WorkspaceExampleComponent {
  constructor(private unauthorizedService: UnauthorizedService) {}

  createWorkspace(): void {
    this.checkPermissionAndExecute(
      'CREATE_WORKSPACE',
      () => this.performCreateWorkspace(),
      {
        title: 'Workspace Creation Denied',
        message: 'Your account level does not allow workspace creation.'
      }
    );
  }

  deleteWorkspace(): void {
    this.checkPermissionAndExecute(
      'DELETE_WORKSPACE',
      () => this.performDeleteWorkspace(),
      {
        title: 'Admin Permission Required',
        message: 'Only administrators can delete workspaces.'
      }
    );
  }

  manageWorkspace(): void {
    this.checkPermissionAndExecute(
      'MANAGE_WORKSPACE',
      () => this.performManageWorkspace(),
      {
        title: 'Management Access Required',
        message: 'You need management permissions for this workspace.'
      }
    );
  }

  private checkPermissionAndExecute(
    permission: string,
    action: () => void,
    config: any
  ): void {
    const userRole = this.getCurrentUserRole();
    
    if (this.unauthorizedService.hasPermission(permission, userRole)) {
      action();
    } else {
      this.unauthorizedService.showUnauthorizedAccess(config);
    }
  }

  private getCurrentUserRole(): string {
    // Implementation to get current user role
    return localStorage.getItem('Role') || 'USER';
  }

  private performCreateWorkspace(): void {
    console.log('Creating workspace...');
  }

  private performDeleteWorkspace(): void {
    console.log('Deleting workspace...');
  }

  private performManageWorkspace(): void {
    console.log('Managing workspace...');
  }
}

// Example 5: Integration with HTTP interceptor for API responses
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class UnauthorizedInterceptorExample implements HttpInterceptor {
  constructor(private unauthorizedService: UnauthorizedService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 403) {
          // Handle 403 Forbidden responses
          this.unauthorizedService.showUnauthorizedAccess({
            title: 'Access Forbidden',
            message: 'The server denied your request. You may not have sufficient permissions.',
            showContactAdmin: true,
            showGoBack: true
          });
        }
        
        if (error.status === 401) {
          // Handle 401 Unauthorized responses
          this.unauthorizedService.showUnauthorizedAccess({
            title: 'Session Expired',
            message: 'Your session has expired. Please log in again.',
            showGoHome: false,
            showGoBack: false,
            showContactAdmin: false
          });
        }

        return throwError(error);
      })
    );
  }
}
