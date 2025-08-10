# Unauthorized Access Component

A comprehensive Angular component system for handling unauthorized access attempts in your application.

## Components

### 1. UnauthorizedComponent
The main component that displays the unauthorized access message with customizable options.

### 2. UnauthorizedModalComponent  
A modal version that can be displayed as an overlay.

### 3. UnauthorizedPageComponent
A standalone page for unauthorized access.

### 4. UnauthorizedService
Service for managing unauthorized access states and permissions.

## Features

- 🎨 **Dark/Light Theme Support** - Automatically adapts to your app's theme
- 📱 **Responsive Design** - Works on all device sizes
- ⚡ **Smooth Animations** - Tailwind CSS animations for better UX
- 🔧 **Highly Customizable** - Multiple configuration options
- 🛡️ **Permission System** - Built-in permission checking
- 📧 **Contact Admin** - Optional admin contact functionality
- 🔄 **Multiple Display Modes** - Modal, page, or embedded

## Basic Usage

### As a Modal (Recommended)

```typescript
// In your component
constructor(private unauthorizedService: UnauthorizedService) {}

// Show unauthorized modal
showUnauthorizedAccess() {
  this.unauthorizedService.showUnauthorizedAccess({
    title: 'Access Denied',
    message: 'You do not have permission to delete this document.',
    showContactAdmin: true
  });
}
```

```html
<!-- Add to your app component template -->
<app-unauthorized-modal></app-unauthorized-modal>
```

### As a Standalone Component

```html
<app-unauthorized
  title="Custom Title"
  message="Custom message here"
  [showContactAdmin]="true"
  [showGoBack]="true"
  [showGoHome]="true"
  contactEmail="admin@yourcompany.com"
  (onContactAdmin)="handleContactAdmin()"
  (onGoBack)="handleGoBack()">
</app-unauthorized>
```

### As a Page

```typescript
// Navigate to unauthorized page
this.unauthorizedService.navigateToUnauthorizedPage({
  title: 'Admin Access Required',
  message: 'You need administrator privileges to access this page.'
});
```

## Configuration Options

```typescript
interface UnauthorizedConfig {
  title?: string;                 // Default: 'Access Denied'
  message?: string;               // Default: 'You do not have permission...'
  showContactAdmin?: boolean;     // Default: true
  showGoBack?: boolean;           // Default: true  
  showGoHome?: boolean;           // Default: true
  contactEmail?: string;          // Default: 'admin@example.com'
  redirectPath?: string;          // Custom redirect path
}
```

## Permission System

The service includes a built-in permission system:

```typescript
// Check if user has permission
const hasPermission = this.unauthorizedService.hasPermission('DELETE_DOCUMENT', 'USER');

// Check permission and show unauthorized if not allowed
const canProceed = this.unauthorizedService.checkPermissionOrShowUnauthorized(
  'ADMIN_DASHBOARD', 
  userRole,
  {
    title: 'Admin Required',
    message: 'This action requires admin privileges.'
  }
);

if (canProceed) {
  // Proceed with action
}
```

### Available Permissions

- `CREATE_DOCUMENT` - Create new documents
- `DELETE_DOCUMENT` - Delete documents  
- `ADMIN_DASHBOARD` - Access admin dashboard
- `MANAGE_USERS` - Manage user accounts
- `VIEW_ALL_DOCUMENTS` - View all documents
- `ARCHIVE_DOCUMENT` - Archive documents
- `SHARE_DOCUMENT` - Share documents
- `CREATE_WORKSPACE` - Create workspaces
- `DELETE_WORKSPACE` - Delete workspaces
- `MANAGE_WORKSPACE` - Manage workspaces

## Guard Integration

Update your guards to use the unauthorized service:

```typescript
export const adminGuard: CanActivateFn = (route, state) => {
  const unauthorizedService = inject(UnauthorizedService);
  const authService = inject(AuthService);
  
  const userRole = authService.getUserRole();
  
  if (userRole === 'ADMIN') {
    return true;
  } else {
    unauthorizedService.navigateToUnauthorizedPage({
      title: 'Admin Access Required',
      message: 'You need administrator privileges to access this page.'
    });
    return false;
  }
};
```

## Styling Customization

The component uses Tailwind CSS classes and supports dark mode. You can customize the appearance by:

1. **CSS Custom Properties** - Define custom colors in your theme
2. **Tailwind Classes** - Override classes in component templates
3. **SCSS Variables** - Modify the component's SCSS file

## Events

The component emits the following events:

- `onContactAdmin` - When contact admin button is clicked
- `onGoBack` - When go back button is clicked

```typescript
handleContactAdmin() {
  // Custom logic for contacting admin
  // Default: opens email client
}

handleGoBack() {
  // Custom logic for going back
  // Default: window.history.back()
}
```

## Advanced Examples

### Custom Action Handler

```typescript
// Show unauthorized with custom handlers
this.unauthorizedService.showUnauthorizedAccess({
  title: 'Document Locked',
  message: 'This document is currently being edited by another user.',
  showContactAdmin: false,
  showGoHome: false
});

// Listen for events
this.unauthorizedComponent.onGoBack.subscribe(() => {
  this.router.navigate(['/documents']);
});
```

### Integration with Forms

```typescript
onSubmitForm() {
  if (!this.unauthorizedService.hasPermission('EDIT_DOCUMENT', this.userRole)) {
    this.unauthorizedService.showUnauthorizedAccess({
      title: 'Edit Permission Required',
      message: 'You need edit permissions to modify this document.',
      showContactAdmin: true
    });
    return;
  }
  
  // Proceed with form submission
  this.submitForm();
}
```

## Accessibility

The component includes:

- Proper ARIA labels
- Keyboard navigation support
- Screen reader friendly text
- Focus management
- High contrast support

## Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## Dependencies

- Angular 17+
- Tailwind CSS 3+
- Font Awesome (for icons)
