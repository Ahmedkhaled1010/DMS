import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { DocumentNavigationService } from './document-navigation.service';

describe('DocumentNavigationService', () => {
  let service: DocumentNavigationService;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        DocumentNavigationService,
        { provide: Router, useValue: spy }
      ]
    });
    
    service = TestBed.inject(DocumentNavigationService);
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should validate document data correctly', () => {
    const validData = {
      base64: 'SGVsbG8gV29ybGQ=',
      fileName: 'test.txt',
      fileType: 'txt',
      mimeType: 'text/plain'
    };

    expect(service.validateDocumentData(validData)).toBe(true);
    expect(service.validateDocumentData(null as any)).toBe(false);
    expect(service.validateDocumentData({ ...validData, base64: '' })).toBe(false);
  });

  it('should check supported file types', () => {
    expect(service.isFileTypeSupported('pdf')).toBe(true);
    expect(service.isFileTypeSupported('jpg')).toBe(true);
    expect(service.isFileTypeSupported('xyz')).toBe(false);
  });
});

/*
Example Usage:

// In your component:
import { DocumentNavigationService } from '../Services/DocumentNavigation/document-navigation.service';

export class YourComponent {
  constructor(private documentNavService: DocumentNavigationService) {}

  // Example 1: Navigate with object
  previewDocument() {
    const documentData = {
      base64: 'JVBERi0xLjQKJYGBgYEKMS4uLg==', // Your base64 data
      fileName: 'sample.pdf',
      fileType: 'pdf',
      mimeType: 'application/pdf'
    };

    this.documentNavService.navigateToDocumentReview(documentData);
  }

  // Example 2: Navigate with parameters
  previewImage() {
    const base64 = 'iVBORw0KGgoAAAANSUhEUgAA...'; // Your image base64
    this.documentNavService.navigateToDocumentReviewParams(
      base64, 
      'photo.png', 
      'png', 
      'image/png'
    );
  }

  // Example 3: Open in new window
  openInNewWindow() {
    const documentData = {
      base64: 'your-base64-data',
      fileName: 'document.pdf',
      fileType: 'pdf'
    };

    this.documentNavService.openDocumentReviewInNewWindow(documentData);
  }

  // Example 4: Direct download
  downloadDocument() {
    const documentData = {
      base64: 'your-base64-data',
      fileName: 'document.pdf',
      fileType: 'pdf'
    };

    this.documentNavService.downloadDocument(documentData);
  }
}
*/
