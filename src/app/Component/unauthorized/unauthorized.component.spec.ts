import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ThemeService } from '../../Services/Theme/theme.service';
import { UnauthorizedComponent } from './unauthorized.component';
import { BehaviorSubject } from 'rxjs';

describe('UnauthorizedComponent', () => {
  let component: UnauthorizedComponent;
  let fixture: ComponentFixture<UnauthorizedComponent>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockThemeService: jasmine.SpyObj<ThemeService>;
  let themeSubject: BehaviorSubject<'light' | 'dark'>;

  beforeEach(async () => {
    themeSubject = new BehaviorSubject<'light' | 'dark'>('light');
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockThemeService = jasmine.createSpyObj('ThemeService', [], {
      theme$: themeSubject.asObservable()
    });

    await TestBed.configureTestingModule({
      imports: [UnauthorizedComponent],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: ThemeService, useValue: mockThemeService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UnauthorizedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display default title and message', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Access Denied');
    expect(compiled.querySelector('p')?.textContent).toContain('You do not have permission to perform this action.');
  });

  it('should display custom title and message', () => {
    component.title = 'Custom Title';
    component.message = 'Custom message';
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Custom Title');
    expect(compiled.querySelector('p')?.textContent).toContain('Custom message');
  });

  it('should navigate to home when goHome is called', () => {
    component.goHome();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/home']);
  });

  it('should emit onGoBack event when goBack is called and there are observers', () => {
    spyOn(component.onGoBack, 'emit');
    component.onGoBack.subscribe(() => {});
    
    component.goBack();
    expect(component.onGoBack.emit).toHaveBeenCalled();
  });

  it('should emit onContactAdmin event when contactAdmin is called and there are observers', () => {
    spyOn(component.onContactAdmin, 'emit');
    component.onContactAdmin.subscribe(() => {});
    
    component.contactAdmin();
    expect(component.onContactAdmin.emit).toHaveBeenCalled();
  });

  it('should update isDarkMode when theme changes', () => {
    expect(component.isDarkMode).toBeFalse();
    
    themeSubject.next('dark');
    expect(component.isDarkMode).toBeTrue();
    
    themeSubject.next('light');
    expect(component.isDarkMode).toBeFalse();
  });

  it('should show/hide buttons based on input properties', () => {
    component.showGoBack = false;
    component.showGoHome = false;
    component.showContactAdmin = false;
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('button')).toBeFalsy();
  });
});
