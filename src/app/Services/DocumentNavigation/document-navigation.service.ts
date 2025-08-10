import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

export interface DocumentPreviewData {
  base64: string;
  fileName: string;
  fileType: string;
  mimeType?: string;
}

@Injectable({
  providedIn: 'root'
})
export class DocumentNavigationService {

  constructor(private router: Router) {}

  /**
   * Navigate to document review page with base64 document data
   * @param documentData The document data to preview
   */
  async navigateToDocumentReview(documentData: DocumentPreviewData): Promise<boolean> {
    try {
      // Encode the document data to pass it safely in URL
      const encodedData = encodeURIComponent(JSON.stringify(documentData));
      
      return await this.router.navigate(['/home/reviewdocument'], {
        queryParams: { data: encodedData }
      });
    } catch (error) {
      console.error('Error navigating to document review:', error);
      return false;
    }
  }

  /**
   * Navigate to document review page with individual parameters
   * @param base64 Base64 encoded document content
   * @param fileName Name of the document file
   * @param fileType File type/extension
   * @param mimeType Optional MIME type
   */
  async navigateToDocumentReviewParams(
    base64: string, 
    fileName: string, 
    fileType: string, 
    mimeType?: string
  ): Promise<boolean> {
    try {
      const queryParams: any = {
        base64: base64,
        fileName: fileName,
        fileType: fileType
      };

      if (mimeType) {
        queryParams.mimeType = mimeType;
      }

      return await this.router.navigate(['/home/reviewdocument'], {
        queryParams: queryParams
      });
    } catch (error) {
      console.error('Error navigating to document review:', error);
      return false;
    }
  }

  /**
   * Navigate to document review page in a new window/tab
   * @param documentData The document data to preview
   */
  openDocumentReviewInNewWindow(documentData: DocumentPreviewData): void {
    try {
      const encodedData = encodeURIComponent(JSON.stringify(documentData));
      const url = `/home/reviewdocument?data=${encodedData}`;
      
      window.open(url, '_blank', 'width=1200,height=800,scrollbars=yes,resizable=yes');
    } catch (error) {
      console.error('Error opening document review in new window:', error);
    }
  }

  /**
   * Validate document data before navigation
   * @param documentData The document data to validate
   */
  validateDocumentData(documentData: DocumentPreviewData): boolean {
    if (!documentData) {
      console.error('Document data is required');
      return false;
    }

    if (!documentData.base64 || documentData.base64.trim() === '') {
      console.error('Base64 content is required');
      return false;
    }

    if (!documentData.fileName || documentData.fileName.trim() === '') {
      console.error('File name is required');
      return false;
    }

    if (!documentData.fileType || documentData.fileType.trim() === '') {
      console.error('File type is required');
      return false;
    }

    return true;
  }

  /**
   * Create a download link for a base64 document
   * @param documentData The document data
   */
  downloadDocument(documentData: DocumentPreviewData): void {
    try {
      if (!this.validateDocumentData(documentData)) {
        return;
      }

      const base64Data = documentData.base64;
      const mimeType = documentData.mimeType || this.getMimeTypeFromExtension(documentData.fileType);
      
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
      a.download = documentData.fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading document:', error);
    }
  }

  /**
   * Get MIME type from file extension
   * @param fileType File extension
   */
  private getMimeTypeFromExtension(fileType: string): string {
    const extension = fileType.toLowerCase().replace('.', '');
    
    const mimeTypes: { [key: string]: string } = {
      'pdf': 'application/pdf',
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'gif': 'image/gif',
      'bmp': 'image/bmp',
      'webp': 'image/webp',
      'svg': 'image/svg+xml',
      'mp4': 'video/mp4',
      'webm': 'video/webm',
      'ogg': 'video/ogg',
      'avi': 'video/avi',
      'mov': 'video/mov',
      'mp3': 'audio/mp3',
      'wav': 'audio/wav',
      'flac': 'audio/flac',
      'aac': 'audio/aac',
      'txt': 'text/plain',
      'html': 'text/html',
      'css': 'text/css',
      'js': 'text/javascript',
      'json': 'application/json',
      'csv': 'text/csv',
      'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'doc': 'application/msword',
      'xls': 'application/vnd.ms-excel',
      'ppt': 'application/vnd.ms-powerpoint'
    };

    return mimeTypes[extension] || 'application/octet-stream';
  }

  /**
   * Get supported file types for preview
   */
  getSupportedFileTypes(): string[] {
    return [
      'pdf', 'jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg',
      'mp4', 'webm', 'ogg', 'avi', 'mov',
      'mp3', 'wav', 'flac', 'aac',
      'txt', 'html', 'css', 'js', 'json', 'csv',
      'docx', 'xlsx', 'pptx', 'doc', 'xls', 'ppt'
    ];
  }

  /**
   * Check if file type is supported for preview
   * @param fileType File extension
   */
  isFileTypeSupported(fileType: string): boolean {
    const extension = fileType.toLowerCase().replace('.', '');
    return this.getSupportedFileTypes().includes(extension);
  }
}
