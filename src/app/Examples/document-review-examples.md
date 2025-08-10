# Document Review Component Usage Examples

The ReviewDocument component can preview various document types from base64 strings. Here are examples of how to use it:

## Navigation Methods

### Method 1: Using DocumentNavigationService (Recommended)

```typescript
import { DocumentNavigationService } from '../Services/DocumentNavigation/document-navigation.service';

export class YourComponent {
  constructor(private documentNavService: DocumentNavigationService) {}

  // Navigate to review page with document data
  previewDocument() {
    const documentData = {
      base64: 'JVBERi0xLjQKJYGBgYE...', // Your base64 PDF data
      fileName: 'sample.pdf',
      fileType: 'pdf',
      mimeType: 'application/pdf'
    };

    this.documentNavService.navigateToDocumentReview(documentData);
  }
}
```

### Method 2: Direct Router Navigation

```typescript
import { Router } from '@angular/router';

export class YourComponent {
  constructor(private router: Router) {}

  previewDocument() {
    const documentData = {
      base64: 'your-base64-data',
      fileName: 'document.pdf',
      fileType: 'pdf'
    };

    const encodedData = encodeURIComponent(JSON.stringify(documentData));
    this.router.navigate(['/home/reviewdocument'], {
      queryParams: { data: encodedData }
    });
  }
}
```

## Supported File Types

### PDF Documents
```typescript
const pdfData = {
  base64: 'JVBERi0xLjQK...', // PDF base64
  fileName: 'document.pdf',
  fileType: 'pdf',
  mimeType: 'application/pdf'
};
```

### Images
```typescript
const imageData = {
  base64: 'iVBORw0KGgoAAAANSUhEUgA...', // Image base64
  fileName: 'photo.png',
  fileType: 'png',
  mimeType: 'image/png'
};
```

### Videos
```typescript
const videoData = {
  base64: 'AAAAIGZ0eXBtcDQ...', // Video base64
  fileName: 'video.mp4',
  fileType: 'mp4',
  mimeType: 'video/mp4'
};
```

### Audio Files
```typescript
const audioData = {
  base64: 'SUQzBAAAAAAAI1RT...', // Audio base64
  fileName: 'audio.mp3',
  fileType: 'mp3',
  mimeType: 'audio/mp3'
};
```

### Office Documents
```typescript
const officeData = {
  base64: 'UEsDBBQACAgI...', // Office document base64
  fileName: 'document.docx',
  fileType: 'docx',
  mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
};
```

### Text Files
```typescript
const textData = {
  base64: 'SGVsbG8gV29ybGQh', // "Hello World!" in base64
  fileName: 'readme.txt',
  fileType: 'txt',
  mimeType: 'text/plain'
};
```

## Advanced Usage

### Open in New Window
```typescript
this.documentNavService.openDocumentReviewInNewWindow(documentData);
```

### Direct Download
```typescript
this.documentNavService.downloadDocument(documentData);
```

### Validate Before Navigation
```typescript
if (this.documentNavService.validateDocumentData(documentData)) {
  this.documentNavService.navigateToDocumentReview(documentData);
} else {
  console.error('Invalid document data');
}
```

### Check if File Type is Supported
```typescript
if (this.documentNavService.isFileTypeSupported('pdf')) {
  // Proceed with navigation
}
```

## Component Features

The ReviewDocument component provides:

- **Multi-format support**: PDF, Images, Videos, Audio, Text, Office documents
- **Zoom controls**: For images and PDFs
- **Download functionality**: Save any document to device
- **Print support**: Print documents directly from browser
- **Responsive design**: Works on desktop and mobile
- **Dark mode support**: Automatic theme switching
- **Error handling**: Graceful error states for unsupported files
- **Loading states**: Visual feedback during document loading
- **Accessibility**: Screen reader friendly with proper ARIA labels

## Route Information

The component is available at: `/home/reviewdocument`

Query parameters:
- `data`: JSON encoded document data (recommended)
- Alternative: `base64`, `fileName`, `fileType`, `mimeType` as separate parameters

## Security Considerations

- Base64 data is sanitized using Angular's DomSanitizer
- File types are validated before processing
- Safe URL creation for different content types
- Memory cleanup for blob URLs to prevent leaks

## Browser Compatibility

- **PDF**: Uses iframe/embed (requires PDF plugin or modern browser)
- **Images**: Native img tag support
- **Videos**: HTML5 video tag (MP4, WebM, OGG)
- **Audio**: HTML5 audio tag (MP3, WAV, OGG, AAC)
- **Text**: Iframe for text content
- **Office**: Download recommended (some browsers may support inline viewing)
