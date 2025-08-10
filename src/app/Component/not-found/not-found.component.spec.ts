import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { ThemeService } from '../../Services/Theme/theme.service';
import { NotFoundComponent } from './not-found.component';
import { BehaviorSubject } from 'rxjs';
import { FormsModule } from '@angular/forms';

describe('NotFoundComponent', () => {
  let component: NotFoundComponent;
  let fixture: ComponentFixture<NotFoundComponent>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockLocation: jasmine.SpyObj<Location>;
  let mockThemeService: jasmine.SpyObj<ThemeService>;
  let themeSubject: BehaviorSubject<'light' | 'dark'>;

  beforeEach(async () => {
    themeSubject = new BehaviorSubject<'light' | 'dark'>('light');
    mockRouter = jasmine.createSpyObj('Router', ['navigate'], {
      url: '/non-existent-page'
    });
    mockLocation = jasmine.createSpyObj('Location', ['back']);
    mockThemeService = jasmine.createSpyObj('ThemeService', [], {
      theme$: themeSubject.asObservable()
    });

    await TestBed.configureTestingModule({
      imports: [NotFoundComponent, FormsModule],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: Location, useValue: mockLocation },
        { provide: ThemeService, useValue: mockThemeService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NotFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display default title and message', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Page Not Found');
    expect(compiled.querySelector('p')?.textContent).toContain('The page you are looking for does not exist');
  });

  it('should display custom title and message', () => {
    component.title = 'Custom 404 Title';
    component.message = 'Custom 404 message';
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Custom 404 Title');
    expect(compiled.querySelector('p')?.textContent).toContain('Custom 404 message');
  });

  it('should navigate to home when goHome is called', () => {
    component.goHome();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/home']);
  });

  it('should go back when goBack is called and no observers', () => {
    component.goBack();
    expect(mockLocation.back).toHaveBeenCalled();
  });

  it('should emit onGoBack event when there are observers', () => {
    spyOn(component.onGoBack, 'emit');
    component.onGoBack.subscribe(() => {});
    
    component.goBack();
    expect(component.onGoBack.emit).toHaveBeenCalled();
    expect(mockLocation.back).not.toHaveBeenCalled();
  });

  it('should navigate to specific route', () => {
    const testPath = '/home/documents';
    component.navigateTo(testPath);
    expect(mockRouter.navigate).toHaveBeenCalledWith([testPath]);
  });

  it('should handle search submission with default behavior', () => {
    component.searchQuery = 'test search';
    component.onSearchSubmit();
    
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/home/Documents'], {
      queryParams: { search: 'test search' }
    });
  });

  it('should emit search event when there are observers', () => {
    spyOn(component.onSearch, 'emit');
    component.onSearch.subscribe(() => {});
    component.searchQuery = 'test search';
    
    component.onSearchSubmit();
    expect(component.onSearch.emit).toHaveBeenCalledWith('test search');
  });

  it('should not submit search with empty query', () => {
    component.searchQuery = '   ';
    component.onSearchSubmit();
    
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('should update isDarkMode when theme changes', () => {
    expect(component.isDarkMode).toBeFalse();
    
    themeSubject.next('dark');
    expect(component.isDarkMode).toBeTrue();
    
    themeSubject.next('light');
    expect(component.isDarkMode).toBeFalse();
  });

  it('should return current URL', () => {
    const url = component.getCurrentUrl();
    expect(url).toBe('/non-existent-page');
  });

  it('should show/hide elements based on input properties', () => {
    component.showGoBack = false;
    component.showGoHome = false;
    component.showSearch = false;
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('input[type="text"]')).toBeFalsy();
    
    // Should still have suggested routes
    expect(compiled.querySelectorAll('.grid button').length).toBeGreaterThan(0);
  });

  it('should display suggested routes', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const routeButtons = compiled.querySelectorAll('.grid button');
    
    expect(routeButtons.length).toBeGreaterThanOrEqual(4); // Default suggested routes
    expect(compiled.textContent).toContain('Dashboard');
    expect(compiled.textContent).toContain('Documents');
    expect(compiled.textContent).toContain('Workspaces');
    expect(compiled.textContent).toContain('Profile');
  });

  it('should display custom routes when provided', () => {
    component.customRoutes = [
      { label: 'Custom Page', path: '/custom' },
      { label: 'Another Page', path: '/another' }
    ];
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Custom Page');
    expect(compiled.textContent).toContain('Another Page');
  });

  it('should navigate to suggested routes when clicked', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const dashboardButton = Array.from(compiled.querySelectorAll('button'))
      .find(btn => btn.textContent?.includes('Dashboard'));
    
    dashboardButton?.click();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/home/dashboard']);
  });
});
