import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

// PrimeNG Imports
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageService } from 'primeng/api';

import { DocumentService } from '../../Services/Document/document.service';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClient, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-shared-document-view',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    ToastModule,
    TooltipModule,
    ProgressSpinnerModule,
    TranslateModule
  ],
  providers: [MessageService],
  templateUrl: './shared-document-view.component.html',
  styleUrl: './shared-document-view.component.scss'
})
export class SharedDocumentViewComponent implements OnInit, OnDestroy {
  loading = true;
  error = false;
  errorMessage = '';
  fileLoaded = false;
  fileUrl: string = '';
  safeFileUrl: SafeResourceUrl | null = null;
  fileName: string = '';
  fileType: string = '';
  fileSize: number = 0;
  fileExtension: string = '';
  
  private destroy$ = new Subject<void>();
  private token: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private documentService: DocumentService,
    private messageService: MessageService,
    private http: HttpClient,
    public sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.token = this.route.snapshot.paramMap.get('token') || '';
    console.log('Token from URL:', this.token);
    if (this.token) {
      this.loadSharedFile();
    } else {
      this.handleError('Invalid shared link');
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    
    // Clean up file URL to prevent memory leaks
    if (this.fileUrl) {
      window.URL.revokeObjectURL(this.fileUrl);
    }
  }

  loadSharedFile(): void {
    this.loading = true;
    this.error = false;
    console.log('Loading shared file with token:', this.token);
    
    this.getFileByToken(this.token)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log('File response received:', response);
          this.processFileResponse(response);
          this.fileLoaded = true;
          this.loading = false;
          console.log('File loaded successfully');
        },
        error: (error) => {
          console.error('Error loading shared file:', error);
          this.handleError('File not found or access denied');
        }
      });
  }

  private getFileByToken(token: string) {
    // Use your actual backend API endpoint for shared files
    const url = `share/${token}`;
    return this.http.get(url, {
      observe: 'response',
      responseType: 'blob'
    });
  }

  private processFileResponse(response: HttpResponse<Blob>): void {
    const blob = response.body;
    if (!blob) {
      console.error('No blob data received');
      return;
    }

    console.log('Processing file response - blob size:', blob.size, 'type:', blob.type);

    // Extract filename from Content-Disposition header
    const contentDisposition = response.headers.get('Content-Disposition');
    console.log('Content-Disposition header:', contentDisposition);
    if (contentDisposition) {
      const matches = /filename="(.+)"/.exec(contentDisposition);
      if (matches && matches[1]) {
        this.fileName = matches[1];
      }
    }
    
    if (!this.fileName) {
      this.fileName = 'shared-file';
    }

    // Extract file extension
    const parts = this.fileName.split('.');
    this.fileExtension = parts.length > 1 ? parts.pop()?.toLowerCase() || '' : '';

    // Get file type from Content-Type header or blob type
    this.fileType = response.headers.get('Content-Type') || blob.type || 'application/octet-stream';
    this.fileSize = blob.size;

    console.log('File details:', {
      fileName: this.fileName,
      fileExtension: this.fileExtension,
      fileType: this.fileType,
      fileSize: this.fileSize
    });

    // Create object URL for viewing
    this.fileUrl = window.URL.createObjectURL(blob);
    console.log('File URL created:', this.fileUrl);
    
    // Create safe URL for iframe usage
    this.safeFileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.fileUrl);
    console.log('Safe URL created for iframe viewing');

    this.messageService.add({
      severity: 'success',
      summary: 'تم التحميل',
      detail: 'تم تحميل الملف بنجاح'
    });
  }

  private handleError(message: string): void {
    this.error = true;
    this.errorMessage = message;
    this.loading = false;
    this.messageService.add({
      severity: 'error',
      summary: 'خطأ',
      detail: message
    });
  }

  downloadFile(): void {
    if (this.fileUrl && this.fileName) {
      const a = document.createElement('a');
      a.href = this.fileUrl;
      a.download = this.fileName;
      a.click();
      
      this.messageService.add({
        severity: 'success',
        summary: 'تحميل',
        detail: 'تم بدء تحميل الملف'
      });
    }
  }

  refreshFile(): void {
    if (this.token) {
      // Clean up previous file URL
      if (this.fileUrl) {
        window.URL.revokeObjectURL(this.fileUrl);
      }
      this.loadSharedFile();
    }
  }

  copyLink(): void {
    const currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl).then(() => {
      this.messageService.add({
        severity: 'success',
        summary: 'تم النسخ',
        detail: 'تم نسخ رابط الملف'
      });
    }).catch(() => {
      this.messageService.add({
        severity: 'error',
        summary: 'خطأ',
        detail: 'فشل في نسخ الرابط'
      });
    });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  goToHome(): void {
    this.router.navigate(['/']);
  }

  // Enhanced file type detection methods
  isImageFile(): boolean {
    return this.fileType.startsWith('image/') || 
           ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg', 'ico'].includes(this.fileExtension);
  }

  isPdfFile(): boolean {
    return this.fileType === 'application/pdf' || this.fileExtension === 'pdf';
  }

  isVideoFile(): boolean {
    return this.fileType.startsWith('video/') || 
           ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv', '3gp'].includes(this.fileExtension);
  }

  isAudioFile(): boolean {
    return this.fileType.startsWith('audio/') || 
           ['mp3', 'wav', 'ogg', 'flac', 'aac', 'm4a', 'wma'].includes(this.fileExtension);
  }

  isTextFile(): boolean {
    return this.fileType.startsWith('text/') || 
           this.fileType === 'application/json' ||
           this.fileType === 'application/xml' ||
           ['txt', 'json', 'xml', 'css', 'js', 'html', 'md', 'csv'].includes(this.fileExtension);
  }

  isOfficeFile(): boolean {
    return ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'].includes(this.fileExtension) ||
           this.fileType.includes('officedocument') ||
           this.fileType.includes('msword') ||
           this.fileType.includes('excel') ||
           this.fileType.includes('powerpoint');
  }

  canPreviewInIframe(): boolean {
    return this.isPdfFile() || this.isTextFile() || this.isImageFile();
  }

  canPreviewNatively(): boolean {
    return this.isImageFile() || this.isVideoFile() || this.isAudioFile();
  }

  canPreview(): boolean {
    return this.canPreviewInIframe() || this.canPreviewNatively() || this.isOfficeFile();
  }

  // Get Google Docs viewer URL for office files
  getGoogleDocsViewerUrl(): string {
    if (this.isOfficeFile() && this.fileUrl) {
      return `https://docs.google.com/gview?url=${encodeURIComponent(this.fileUrl)}&embedded=true`;
    }
    return '';
  }

  // Get Office online viewer URL
  getOfficeOnlineViewerUrl(): string {
    if (this.isOfficeFile() && this.fileUrl) {
      return `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(this.fileUrl)}`;
    }
    return '';
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 بايت';

    const k = 1024;
    const sizes = ['بايت', 'كيلوبايت', 'ميجابايت', 'جيجابايت'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  getFileIcon(): string {
    if (this.isImageFile()) return 'pi pi-image';
    if (this.isPdfFile()) return 'pi pi-file-pdf';
    if (this.isVideoFile()) return 'pi pi-video';
    if (this.isAudioFile()) return 'pi pi-volume-up';
    if (this.isTextFile()) return 'pi pi-file-edit';
    
    const iconMap: { [key: string]: string } = {
      doc: 'pi pi-file-word',
      docx: 'pi pi-file-word',
      xls: 'pi pi-file-excel',
      xlsx: 'pi pi-file-excel',
      ppt: 'pi pi-file',
      pptx: 'pi pi-file',
      zip: 'pi pi-file-export',
      rar: 'pi pi-file-export',
      '7z': 'pi pi-file-export',
    };
    
    return iconMap[this.fileExtension] || 'pi pi-file';
  }

  getFileTypeLabel(): string {
    const typeMap: { [key: string]: string } = {
      pdf: 'مستند PDF',
      doc: 'مستند Word',
      docx: 'مستند Word',
      xls: 'جدول Excel',
      xlsx: 'جدول Excel',
      ppt: 'عرض PowerPoint',
      pptx: 'عرض PowerPoint',
      txt: 'ملف نصي',
      jpg: 'صورة JPEG',
      jpeg: 'صورة JPEG',
      png: 'صورة PNG',
      gif: 'صورة GIF',
      mp4: 'فيديو MP4',
      mp3: 'ملف صوتي MP3',
      zip: 'ملف مضغوط ZIP',
      rar: 'ملف مضغوط RAR',
    };
    
    return typeMap[this.fileExtension] || this.fileType || 'ملف';
  }
}
