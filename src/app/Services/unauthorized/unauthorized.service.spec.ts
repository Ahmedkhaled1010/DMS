import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { UnauthorizedService } from './unauthorized.service';

describe('UnauthorizedService', () => {
  let service: UnauthorizedService;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(() => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: mockRouter }
      ]
    });
    service = TestBed.inject(UnauthorizedService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should show unauthorized access with default config', () => {
    service.showUnauthorizedAccess();
    
    service.showUnauthorized$.subscribe(show => {
      expect(show).toBeTrue();
    });

    service.config$.subscribe(config => {
      expect(config.title).toBe('Access Denied');
      expect(config.message).toBe('You do not have permission to perform this action.');
    });
  });

  it('should show unauthorized access with custom config', () => {
    const customConfig = {
      title: 'Custom Title',
      message: 'Custom message'
    };

    service.showUnauthorizedAccess(customConfig);
    
    service.config$.subscribe(config => {
      expect(config.title).toBe('Custom Title');
      expect(config.message).toBe('Custom message');
    });
  });

  it('should hide unauthorized access', () => {
    service.showUnauthorizedAccess();
    service.hideUnauthorizedAccess();
    
    service.showUnauthorized$.subscribe(show => {
      expect(show).toBeFalse();
    });
  });

  it('should navigate to unauthorized page', () => {
    service.navigateToUnauthorizedPage();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/unauthorized']);
  });

  it('should check permissions correctly', () => {
    expect(service.hasPermission('ADMIN_DASHBOARD', 'ADMIN')).toBeTrue();
    expect(service.hasPermission('ADMIN_DASHBOARD', 'USER')).toBeFalse();
    expect(service.hasPermission('CREATE_DOCUMENT', 'USER')).toBeTrue();
    expect(service.hasPermission('NONEXISTENT_PERMISSION', 'ADMIN')).toBeFalse();
  });

  it('should check permission and show unauthorized if not allowed', () => {
    spyOn(service, 'showUnauthorizedAccess');
    
    const result = service.checkPermissionOrShowUnauthorized('ADMIN_DASHBOARD', 'USER');
    
    expect(result).toBeFalse();
    expect(service.showUnauthorizedAccess).toHaveBeenCalled();
  });

  it('should allow action if permission is granted', () => {
    spyOn(service, 'showUnauthorizedAccess');
    
    const result = service.checkPermissionOrShowUnauthorized('CREATE_DOCUMENT', 'USER');
    
    expect(result).toBeTrue();
    expect(service.showUnauthorizedAccess).not.toHaveBeenCalled();
  });
});
