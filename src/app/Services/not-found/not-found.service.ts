import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';

export interface NotFoundEvent {
  url: string;
  timestamp: Date;
  userAgent?: string;
  referrer?: string;
}

export interface SuggestedRoute {
  path: string;
  label: string;
  icon?: string;
  description?: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotFoundService {
  private notFoundEventsSubject = new BehaviorSubject<NotFoundEvent[]>([]);
  public notFoundEvents$ = this.notFoundEventsSubject.asObservable();

  private commonRoutes: SuggestedRoute[] = [
    { path: '/home/dashboard', label: 'Dashboard', icon: 'fas fa-home', description: 'Your main dashboard' },
    { path: '/home/Documents', label: 'Documents', icon: 'fas fa-file-alt', description: 'Manage your documents' },
    { path: '/home/workspaces', label: 'Workspaces', icon: 'fas fa-briefcase', description: 'Your workspaces' },
    { path: '/home/Folders', label: 'Folders', icon: 'fas fa-folder', description: 'Organize in folders' },
    { path: '/home/profile', label: 'Profile', icon: 'fas fa-user', description: 'Your profile settings' },
    { path: '/home/message', label: 'Messages', icon: 'fas fa-envelope', description: 'Your messages' }
  ];

  constructor(private router: Router) {
    this.trackNavigationErrors();
  }

  /**
   * Track navigation errors and 404s
   */
  private trackNavigationErrors(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      // Check if we're on the 404 page
      if (event.url.includes('**') || this.router.url === '/404') {
        this.logNotFoundEvent(event.url);
      }
    });
  }

  /**
   * Log a 404 event
   */
  logNotFoundEvent(url: string): void {
    const event: NotFoundEvent = {
      url,
      timestamp: new Date(),
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
      referrer: typeof document !== 'undefined' ? document.referrer : undefined
    };

    const currentEvents = this.notFoundEventsSubject.value;
    const updatedEvents = [event, ...currentEvents].slice(0, 50); // Keep last 50 events
    this.notFoundEventsSubject.next(updatedEvents);

    // Store in local storage for persistence
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('notFoundEvents', JSON.stringify(updatedEvents));
    }
  }

  /**
   * Get stored 404 events from local storage
   */
  getStoredEvents(): NotFoundEvent[] {
    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem('notFoundEvents');
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (e) {
          console.error('Error parsing stored not found events:', e);
        }
      }
    }
    return [];
  }

  /**
   * Clear all stored 404 events
   */
  clearStoredEvents(): void {
    this.notFoundEventsSubject.next([]);
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('notFoundEvents');
    }
  }

  /**
   * Get suggested routes based on the 404 URL
   */
  getSuggestedRoutes(notFoundUrl?: string): SuggestedRoute[] {
    if (!notFoundUrl) {
      return this.commonRoutes;
    }

    const suggestions: SuggestedRoute[] = [];
    const urlLower = notFoundUrl.toLowerCase();

    // Smart suggestions based on URL patterns
    if (urlLower.includes('doc')) {
      suggestions.push(
        { path: '/home/Documents', label: 'All Documents', icon: 'fas fa-file-alt' },
        { path: '/home/SharedDocuments', label: 'Shared Documents', icon: 'fas fa-share-alt' },
        { path: '/home/ArchivedDocuments', label: 'Archived Documents', icon: 'fas fa-archive' }
      );
    }

    if (urlLower.includes('work') || urlLower.includes('space')) {
      suggestions.push(
        { path: '/home/workspaces', label: 'Workspaces', icon: 'fas fa-briefcase' },
        { path: '/home/dashboard', label: 'Dashboard', icon: 'fas fa-home' }
      );
    }

    if (urlLower.includes('fold')) {
      suggestions.push(
        { path: '/home/Folders', label: 'Folder Manager', icon: 'fas fa-folder' }
      );
    }

    if (urlLower.includes('profile') || urlLower.includes('user') || urlLower.includes('account')) {
      suggestions.push(
        { path: '/home/profile', label: 'Profile', icon: 'fas fa-user' }
      );
    }

    if (urlLower.includes('message') || urlLower.includes('chat') || urlLower.includes('mail')) {
      suggestions.push(
        { path: '/home/message', label: 'Messages', icon: 'fas fa-envelope' }
      );
    }

    if (urlLower.includes('admin')) {
      suggestions.push(
        { path: '/admin', label: 'Admin Dashboard', icon: 'fas fa-cog' }
      );
    }

    // If no specific suggestions, return common routes
    return suggestions.length > 0 ? [...suggestions, ...this.commonRoutes] : this.commonRoutes;
  }

  /**
   * Search for routes that might match the user's intent
   */
  searchSimilarRoutes(searchTerm: string): SuggestedRoute[] {
    const term = searchTerm.toLowerCase();
    return this.commonRoutes.filter(route => 
      route.label.toLowerCase().includes(term) ||
      route.path.toLowerCase().includes(term) ||
      route.description?.toLowerCase().includes(term)
    );
  }

  /**
   * Get most common 404 URLs for analytics
   */
  getMostCommon404s(): { url: string; count: number }[] {
    const events = this.notFoundEventsSubject.value;
    const urlCounts = new Map<string, number>();

    events.forEach(event => {
      const count = urlCounts.get(event.url) || 0;
      urlCounts.set(event.url, count + 1);
    });

    return Array.from(urlCounts.entries())
      .map(([url, count]) => ({ url, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }

  /**
   * Check if a URL pattern suggests a broken link
   */
  isBrokenLinkPattern(url: string): boolean {
    const brokenPatterns = [
      /\/\d+$/, // URLs ending with just numbers (might be missing route params)
      /\/(edit|delete|view)\/\d+$/, // Action URLs that might have been moved
      /\/null$|\/undefined$/, // URLs with null/undefined values
      /\/{2,}/, // Double slashes indicating malformed URLs
    ];

    return brokenPatterns.some(pattern => pattern.test(url));
  }

  /**
   * Navigate to the most likely correct route
   */
  navigateToSuggestedRoute(notFoundUrl: string): void {
    const suggestions = this.getSuggestedRoutes(notFoundUrl);
    if (suggestions.length > 0) {
      this.router.navigate([suggestions[0].path]);
    } else {
      this.router.navigate(['/home/dashboard']);
    }
  }

  /**
   * Report 404 to analytics (placeholder for future implementation)
   */
  reportToAnalytics(event: NotFoundEvent): void {
    // Placeholder for analytics reporting
    console.log('404 Event for Analytics:', event);
    
    // Future: Send to analytics service
    // this.analyticsService.track('404_error', {
    //   url: event.url,
    //   timestamp: event.timestamp,
    //   userAgent: event.userAgent
    // });
  }
}
