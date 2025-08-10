import {
  Component,
  OnInit,
  OnDestroy,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import {
  DomSanitizer,
  SafeResourceUrl,
  SafeUrl,
} from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { DocumentService } from '../Services/Document/document.service';
import { DocumentModel } from '../Interfaces/Document/document';

export interface DocumentPreviewData {
  base64: string;
  fileName: string;
  fileType: string;
  mimeType: string;
}

@Component({
  selector: 'app-reviewdocument',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reviewdocument.component.html',
  styleUrl: './reviewdocument.component.scss',
})
export class ReviewdocumentComponent implements OnInit, OnDestroy {
  documentData: DocumentPreviewData | null = null;
  documentUrl: SafeResourceUrl | SafeUrl | null = null;
  isLoading = true;
  error: string | null = null;
  documentType:
    | 'pdf'
    | 'image'
    | 'video'
    | 'audio'
    | 'text'
    | 'office'
    | 'unknown' = 'unknown';
  zoomLevel = 1;
  currentPage = 1;
  totalPages = 1;
  docId: string = '';
  private routeSubscription?: Subscription;

  // Supported file types
  private readonly supportedTypes = {
    pdf: ['application/pdf'],
    image: [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/bmp',
      'image/webp',
      'image/svg+xml',
    ],    audio: ['audio/mp3','audio/mb3','audio/webm', 'audio/wav', 'audio/ogg', 'audio/aac', 'audio/flac',"audio/mpeg"],

    video: ['video/mp4', 'video/webm', 'video/ogg', 'video/avi', 'video/mov'],
    text: [
      'text/plain',
      'text/html',
      'text/css',
      'text/javascript',
      'application/json',
      'text/csv',
    ],
    office: [
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx
      'application/msword', // .doc
      'application/vnd.ms-excel', // .xls
      'application/vnd.ms-powerpoint', // .ppt
    ],
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer,
    private _DocumentService: DocumentService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.loadDocumentFromRoute();
  }

  ngOnDestroy(): void {
    this.routeSubscription?.unsubscribe();
    this.cleanup();
  }

  private loadDocumentFromRoute(): void {
    let fileName:string='';
    let fileType:string='';
    let mimeType:string='';
    let base64Strings:string='';
    let document:DocumentPreviewData={
          fileName:'',
          fileType:'',
          base64:'',
          mimeType:''

        }
    this.docId = this.route.snapshot.paramMap.get('data') || '';
    this._DocumentService.getDocumentById(this.docId).subscribe(
      {
        next:(res)=>{
          console.log(res);
              fileName=res.data.fileName
       document.fileType=res.data.fileType
          
       document.fileName=res.data.fileName
          
       
          
        },
        error:(err)=>{
          console.log(err);
          
        }
      }
    )
    this._DocumentService.reviewDocument(this.docId).subscribe({
      next: (res) => {
        console.log(res);
        let base64String = res.data;
        this.documentUrl=base64String
        // لو فيه prefix زي data:...
        if (base64String.includes(',')) {
                   document.mimeType=base64String.split(',')[0];

         mimeType=base64String.split(',')[0];
           base64String = base64String.split(',')[1];
          console.log();
          

        }

        // إزالة أي مسافات أو new lines
        base64String = base64String.replace(/\s/g, '');

        document.base64=base64String
        console.log(base64String);
        
        base64Strings=base64String
      //  const documentData = atob(base64String);
         // const documentData = JSON.parse(decodeURIComponent(base64String));
           //       console.log(documentData);

          this.loadDocument(document)        

      },
      error: (err) => {
        console.log(err);
      },
    });

        
    /*  this.routeSubscription = this.route.queryParams.subscribe(params => {
      try {
        if (params['data']) {
          console.log(params['data']);
          
          // Decode the document data from query parameters
          const documentData = JSON.parse(decodeURIComponent(params['data']));
          this.loadDocument(documentData);
        } else if (params['base64'] && params['fileName'] && params['fileType']) {
          // Alternative method: individual parameters
          const documentData: DocumentPreviewData = {
            base64: params['base64'],
            fileName: params['fileName'],
            fileType: params['fileType'],
            mimeType: this.getMimeTypeFromExtension(params['fileType'])
          };
          this.loadDocument(documentData);
        } else {
          this.setError('No document data provided');
        }
      } catch (error) {
        console.error('Error loading document:', error);
        this.setError('Failed to load document data');
      }
    });*/
  }

  loadDocument(data: DocumentPreviewData): void {
    console.log(data);
    
    try {
      this.isLoading = true;
      this.error = null;
      this.documentData = data;

      // Determine document type
      this.documentType = this.determineDocumentType(
        data.fileType
      );
      console.log(this.documentType);
      
      // Create safe URL for the document
      this.createDocumentUrl();

      this.isLoading = false;
    } catch (error) {
      console.error('Error processing document:', error);
      this.setError('Failed to process document');
    }
  }

  private determineDocumentType(
    mimeTypeOrExtension: string
  ): typeof this.documentType {
    const mimeType = mimeTypeOrExtension.toLowerCase();

    for (const [type, mimeTypes] of Object.entries(this.supportedTypes)) {
      if (
        mimeTypes.some(
          (mt) => mimeType.includes(mt) || mimeType.includes(mt.split('/')[1])
        )
      ) {
        return type as typeof this.documentType;
      }
    }

    // Check by file extension if MIME type detection fails
    if (mimeType.includes('pdf')) return 'pdf';
    if (
      mimeType.includes('jpg') ||
      mimeType.includes('jpeg') ||
      mimeType.includes('png') ||
      mimeType.includes('gif') ||
      mimeType.includes('bmp') ||
      mimeType.includes('webp')
    )
      return 'image';
    if (
      mimeType.includes('mp4') ||
      mimeType.includes('webm') ||
      mimeType.includes('avi') ||
      mimeType.includes('mov')
    )
      return 'video';
    if (
      mimeType.includes('mp3') ||
      mimeType.includes('wav') ||
      mimeType.includes('ogg')
    )
      return 'audio';
    if (
      mimeType.includes('doc') ||
      mimeType.includes('xls') ||
      mimeType.includes('ppt')
    )
      return 'office';
    if (
      mimeType.includes('txt') ||
      mimeType.includes('json') ||
      mimeType.includes('csv')
    )
      return 'text';

    return 'unknown';
  }

  private createDocumentUrl(): void {
    if (!this.documentData) return;

    try {
      const base64Data = this.documentData.base64;
      const mimeType =
        this.documentData.mimeType ||
        this.getMimeTypeFromExtension(this.documentData.fileType);

      // Create data URL
      const dataUrl = `${mimeType},${base64Data}`;

      // Sanitize the URL based on document type
      if (this.documentType === 'pdf' || this.documentType === 'office') {
        this.documentUrl =
          this.sanitizer.bypassSecurityTrustResourceUrl(dataUrl);
      } else {
        this.documentUrl = this.sanitizer.bypassSecurityTrustUrl(dataUrl);
      }
    } catch (error) {
      console.error('Error creating document URL:', error);
      this.setError('Failed to create document preview');
    }
  }

  private getMimeTypeFromExtension(fileType: string): string {
    const extension = fileType.toLowerCase().replace('.', '');

    const mimeTypes: { [key: string]: string } = {
      pdf: 'application/pdf',
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      gif: 'image/gif',
      bmp: 'image/bmp',
      webp: 'image/webp',
      svg: 'image/svg+xml',
      mp4: 'video/mp4',
      webm: 'video/webm',
      ogg: 'video/ogg',
      avi: 'video/avi',
      mov: 'video/mov',
      mp3: 'audio/mp3',
      wav: 'audio/wav',
      flac: 'audio/flac',
      aac: 'audio/aac',
      txt: 'text/plain',
      html: 'text/html',
      css: 'text/css',
      js: 'text/javascript',
      json: 'application/json',
      csv: 'text/csv',
      docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      doc: 'application/msword',
      xls: 'application/vnd.ms-excel',
      ppt: 'application/vnd.ms-powerpoint',
    };

    return mimeTypes[extension] || 'application/octet-stream';
  }

  private setError(message: string): void {
    this.error = message;
    this.isLoading = false;
    this.documentUrl = null;
  }

  private cleanup(): void {
    if (this.documentUrl && isPlatformBrowser(this.platformId)) {
      // Clean up any blob URLs to prevent memory leaks
      if (
        typeof this.documentUrl === 'string' &&
        this.documentUrl.startsWith('blob:')
      ) {
        URL.revokeObjectURL(this.documentUrl);
      }
    }
  }

  // Document control methods
  zoomIn(): void {
    if (this.zoomLevel < 3) {
      this.zoomLevel += 0.25;
    }
  }

  zoomOut(): void {
    if (this.zoomLevel > 0.5) {
      this.zoomLevel -= 0.25;
    }
  }

  resetZoom(): void {
    this.zoomLevel = 1;
  }

  downloadDocument(): void {
    if (!this.documentData) return;

    try {
      const base64Data = this.documentData.base64;
      const mimeType =
        this.documentData.mimeType ||
        this.getMimeTypeFromExtension(this.documentData.fileType);

      // Create blob and download
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: mimeType });

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = this.documentData.fileName || 'document';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading document:', error);
    }
  }

  printDocument(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.print();
    }
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }

  // Get file size from base64
  getFileSize(): string {
    if (!this.documentData?.base64) return 'Unknown';

    const base64Length = this.documentData.base64.length;
    const sizeInBytes = Math.round((base64Length * 3) / 4);

    if (sizeInBytes < 1024) return `${sizeInBytes} B`;
    if (sizeInBytes < 1024 * 1024)
      return `${(sizeInBytes / 1024).toFixed(1)} KB`;
    return `${(sizeInBytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  // Get formatted file type
  getFileTypeBadge(): string {
    switch (this.documentType) {
      case 'pdf':
        return 'PDF';
      case 'image':
        return 'Image';
      case 'video':
        return 'Video';
      case 'audio':
        return 'Audio';
      case 'text':
        return 'Text';
      case 'office':
        return 'Office';
      default:
        return 'File';
    }
  }

  // Check if document type is supported
  isSupported(): boolean {
    return this.documentType !== 'unknown';
  }

  // Get Office 365 viewer URL for office documents
  getOfficeViewerUrl(): string {
    if (this.documentType !== 'office' || !this.documentUrl) return '';

    // For office documents, we can use Microsoft's online viewer
    const encodedUrl = encodeURIComponent(this.documentUrl.toString());
    return `https://view.officeapps.live.com/op/embed.aspx?src=${encodedUrl}`;
  }
}
