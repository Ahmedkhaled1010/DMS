# Not Found (404) Component

A comprehensive Angular component system for handling 404 errors and non-existent routes in your application.

## Components

### 1. NotFoundComponent
The main component that displays a 404 error page with search functionality and helpful navigation options.

### 2. NotFoundPageComponent  
A standalone page component that uses the main NotFoundComponent.

### 3. NotFoundService
Service for tracking 404 events, providing smart suggestions, and analytics.

## Features

- 🎨 **Dark/Light Theme Support** - Automatically adapts to your app's theme
- 📱 **Responsive Design** - Works on all device sizes
- ⚡ **Smooth Animations** - Custom CSS animations for better UX
- 🔍 **Smart Search** - Built-in search functionality with routing
- 🧭 **Smart Suggestions** - Context-aware route suggestions based on URL
- 📊 **Analytics** - Track 404 events for improvement insights
- 🎯 **Customizable** - Multiple configuration options
- ♿ **Accessible** - Full accessibility support

## Basic Usage

### As a Wildcard Route (Recommended)

```typescript
// In app.routes.ts
export const routes: Routes = [
  // ... your other routes
  
  // Wildcard route - must be last
  { path: "**", component: NotFoundPageComponent }
];
```

### As a Standalone Component

```html
<app-not-found
  title="Custom 404 Title"
  message="Custom message for users"
  [showSearch]="true"
  [showGoBack]="true"
  [showGoHome]="true"
  [customRoutes]="myCustomRoutes"
  (onSearch)="handleSearch($event)"
  (onGoBack)="handleGoBack()">
</app-not-found>
```

### Using the Service

```typescript
// Inject the service
constructor(private notFoundService: NotFoundService) {}

// Get smart suggestions based on URL
const suggestions = this.notFoundService.getSuggestedRoutes('/documents/missing');

// Search for similar routes
const searchResults = this.notFoundService.searchSimilarRoutes('workspace');

// Navigate to most likely correct route
this.notFoundService.navigateToSuggestedRoute('/documents/123');
```

## Configuration Options

```typescript
// Component Inputs
@Input() title: string = 'Page Not Found';
@Input() message: string = 'The page you are looking for does not exist...';
@Input() showGoBack: boolean = true;
@Input() showGoHome: boolean = true;
@Input() showSearch: boolean = true;
@Input() customRoutes: Array<{label: string, path: string}> = [];

// Component Outputs
@Output() onSearch = new EventEmitter<string>();
@Output() onGoBack = new EventEmitter<void>();
```

## Smart Suggestions

The service provides intelligent route suggestions based on the 404 URL:

```typescript
// Examples of smart suggestions
'/documents/123' → Suggests document-related pages
'/workspace/abc' → Suggests workspace pages  
'/profile/edit' → Suggests profile pages
'/admin/users' → Suggests admin dashboard
```

## Default Suggested Routes

- **Dashboard** - `/home/dashboard`
- **Documents** - `/home/Documents` 
- **Workspaces** - `/home/workspaces`
- **Folders** - `/home/Folders`
- **Profile** - `/home/profile`
- **Messages** - `/home/message`

## Analytics & Tracking

The service automatically tracks 404 events:

```typescript
// Get 404 analytics
service.notFoundEvents$.subscribe(events => {
  console.log('All 404 events:', events);
});

// Get most common 404s
const commonErrors = service.getMostCommon404s();

// Clear analytics data
service.clearStoredEvents();
```

## Custom Route Examples

```typescript
// In your component
customRoutes = [
  { label: 'All Documents', path: '/home/Documents' },
  { label: 'Shared Documents', path: '/home/SharedDocuments' },
  { label: 'Folder Manager', path: '/home/Folders' },
  { label: 'Admin Panel', path: '/admin' }
];
```

## Search Functionality

```typescript
// Handle search in your component
handleSearch(query: string): void {
  // Navigate to documents with search
  this.router.navigate(['/home/Documents'], {
    queryParams: { search: query }
  });
  
  // Or implement custom search logic
  this.performCustomSearch(query);
}
```

## Advanced Usage

### Custom 404 Page for Specific Sections

```typescript
@Component({
  template: `
    <app-not-found
      title="Document Not Found"
      message="The document you're looking for has been moved or deleted."
      [customRoutes]="documentRoutes"
      [showSearch]="true">
    </app-not-found>
  `
})
export class DocumentNotFoundComponent {
  documentRoutes = [
    { label: 'Recent Documents', path: '/home/Documents' },
    { label: 'Archived Documents', path: '/home/ArchivedDocuments' },
    { label: 'Shared Documents', path: '/home/SharedDocuments' }
  ];
}
```

### Error Boundary Integration

```typescript
// In a parent component
@Component({
  template: `
    <div *ngIf="hasError; else normalContent">
      <app-not-found
        title="Something went wrong"
        message="An unexpected error occurred. Please try again."
        [showSearch]="false">
      </app-not-found>
    </div>
    
    <ng-template #normalContent>
      <router-outlet></router-outlet>
    </ng-template>
  `
})
export class ErrorBoundaryComponent {
  hasError = false;
  
  @HostListener('window:error', ['$event'])
  handleError(event: ErrorEvent) {
    this.hasError = true;
  }
}
```

### HTTP Error Integration

```typescript
// In an HTTP interceptor
@Injectable()
export class NotFoundInterceptor implements HttpInterceptor {
  constructor(private notFoundService: NotFoundService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 404) {
          // Log the 404 API call
          this.notFoundService.logNotFoundEvent(req.url);
          
          // Could redirect to a custom API not found page
          // this.router.navigate(['/api-error'], { 
          //   queryParams: { url: req.url } 
          // });
        }
        return throwError(error);
      })
    );
  }
}
```

## Styling Customization

The component uses Tailwind CSS and supports extensive customization:

```scss
// Custom animations
.custom-404-animation {
  animation: float 3s ease-in-out infinite;
}

// Custom glitch effect for 404 text
.glitch-effect {
  position: relative;
  // ... glitch animation styles
}

// Custom search styling
.search-container {
  // ... custom search styles
}
```

## Accessibility Features

- Screen reader friendly content
- Keyboard navigation support
- High contrast mode support
- ARIA labels and roles
- Focus management
- Semantic HTML structure

## Events

```typescript
// Search event
onSearch.emit(searchQuery); // Emitted when user searches

// Navigation events  
onGoBack.emit(); // Emitted when go back is clicked
```

## Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## Performance

- Lazy loading support
- Minimal bundle impact
- Efficient change detection
- Optimized animations

## Best Practices

1. **Always place wildcard route last** in your routing configuration
2. **Customize suggestions** based on your app's structure
3. **Monitor 404 analytics** to identify broken links
4. **Provide meaningful error messages** for different contexts
5. **Test on mobile devices** for responsive behavior

## Dependencies

- Angular 17+
- Tailwind CSS 3+
- Font Awesome (for icons)
- Angular Router
- Angular Forms (for search functionality)

## Integration Example

```typescript
// Complete setup example
@NgModule({
  imports: [
    // ... other imports
    RouterModule.forRoot([
      // ... your routes
      { path: "**", component: NotFoundPageComponent }
    ])
  ]
})
export class AppModule {
  constructor(private notFoundService: NotFoundService) {
    // Optional: Custom initialization
    this.notFoundService.clearStoredEvents(); // Clear on app start
  }
}
```
