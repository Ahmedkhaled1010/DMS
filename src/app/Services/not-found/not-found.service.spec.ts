import { TestBed } from '@angular/core/testing';
import { Router, NavigationEnd } from '@angular/router';
import { NotFoundService } from './not-found.service';
import { Subject } from 'rxjs';

describe('NotFoundService', () => {
  let service: NotFoundService;
  let mockRouter: jasmine.SpyObj<Router>;
  let routerEventsSubject: Subject<any>;

  beforeEach(() => {
    routerEventsSubject = new Subject();
    mockRouter = jasmine.createSpyObj('Router', ['navigate'], {
      events: routerEventsSubject.asObservable(),
      url: '/test-url'
    });

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: mockRouter }
      ]
    });
    service = TestBed.inject(NotFoundService);
  });

  afterEach(() => {
    // Clean up localStorage
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('notFoundEvents');
    }
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should log not found events', () => {
    const testUrl = '/non-existent-page';
    service.logNotFoundEvent(testUrl);

    service.notFoundEvents$.subscribe(events => {
      expect(events.length).toBe(1);
      expect(events[0].url).toBe(testUrl);
      expect(events[0].timestamp).toBeInstanceOf(Date);
    });
  });

  it('should limit stored events to 50', () => {
    // Add 55 events
    for (let i = 0; i < 55; i++) {
      service.logNotFoundEvent(`/test-${i}`);
    }

    service.notFoundEvents$.subscribe(events => {
      expect(events.length).toBe(50);
      expect(events[0].url).toBe('/test-54'); // Most recent first
    });
  });

  it('should return common routes when no specific URL provided', () => {
    const suggestions = service.getSuggestedRoutes();
    expect(suggestions.length).toBeGreaterThan(0);
    expect(suggestions.some(s => s.path === '/home/dashboard')).toBeTrue();
  });

  it('should suggest document routes for doc-related URLs', () => {
    const suggestions = service.getSuggestedRoutes('/home/documents/123');
    const docRoutes = suggestions.filter(s => s.label.toLowerCase().includes('doc'));
    expect(docRoutes.length).toBeGreaterThan(0);
  });

  it('should suggest workspace routes for workspace-related URLs', () => {
    const suggestions = service.getSuggestedRoutes('/workspace/invalid');
    const workspaceRoutes = suggestions.filter(s => 
      s.label.toLowerCase().includes('workspace') || 
      s.path.includes('workspace')
    );
    expect(workspaceRoutes.length).toBeGreaterThan(0);
  });

  it('should search similar routes by term', () => {
    const results = service.searchSimilarRoutes('doc');
    expect(results.some(r => r.label.toLowerCase().includes('doc'))).toBeTrue();
  });

  it('should identify broken link patterns', () => {
    expect(service.isBrokenLinkPattern('/page/123')).toBeTrue();
    expect(service.isBrokenLinkPattern('/edit/456')).toBeTrue();
    expect(service.isBrokenLinkPattern('/page//double')).toBeTrue();
    expect(service.isBrokenLinkPattern('/null')).toBeTrue();
    expect(service.isBrokenLinkPattern('/home/dashboard')).toBeFalse();
  });

  it('should navigate to suggested route', () => {
    service.navigateToSuggestedRoute('/documents/missing');
    expect(mockRouter.navigate).toHaveBeenCalled();
  });

  it('should get most common 404s', () => {
    service.logNotFoundEvent('/page1');
    service.logNotFoundEvent('/page1');
    service.logNotFoundEvent('/page2');
    service.logNotFoundEvent('/page1');

    const common = service.getMostCommon404s();
    expect(common[0].url).toBe('/page1');
    expect(common[0].count).toBe(3);
    expect(common[1].url).toBe('/page2');
    expect(common[1].count).toBe(1);
  });

  it('should clear stored events', () => {
    service.logNotFoundEvent('/test');
    service.clearStoredEvents();

    service.notFoundEvents$.subscribe(events => {
      expect(events.length).toBe(0);
    });
  });

  it('should report to analytics', () => {
    spyOn(console, 'log');
    const event = {
      url: '/test',
      timestamp: new Date()
    };

    service.reportToAnalytics(event);
    expect(console.log).toHaveBeenCalledWith('404 Event for Analytics:', event);
  });
});
