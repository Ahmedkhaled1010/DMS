import { CommonModule, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { DocumentService } from '../../Services/Document/document.service';
import { MessageService } from 'primeng/api';
import { DocumentModel } from '../../Interfaces/Document/document';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-public',
  standalone: true,
  imports: [TranslateModule, DatePipe, CommonModule, RouterLink],
  providers: [MessageService],
  templateUrl: './public.component.html',
  styleUrl: './public.component.scss',
})
export class PublicComponent {
  loading: boolean = true;
  error: string | null = null;
  favouriteDocument: DocumentModel[] = [];
  publicDocuments: any[] = []; // Replace 'any' with your document interface
  // Add properties for search input if you implement it

  constructor(
    private documentService: DocumentService,
    private messageService: MessageService // Inject your service
  ) {}

  ngOnInit(): void {
    this.fetchPublicDocuments();
   
  }
  getAllFav() {
    this.documentService.getFavoriteDocuments().subscribe({
      next: (res) => {
        console.log(res);
        this.favouriteDocument = res.data.document;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  fetchPublicDocuments(): void {
     this.getAllFav();
    this.loading = true;
    this.error = null;
    // Simulate API call
    setTimeout(() => {
      this.documentService.getAllPublicDocuments().subscribe({
        next: (response) => {
          this.publicDocuments = response.data; // Assuming response is an array of documents
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to load documents. Please try again.';
          this.loading = false;
        },
      });
      // Replace with actual API call to fetch public documents
      const mockDocuments = [
        {
          id: '1',
          fileName: 'Project Proposal',
          description: 'Detailed proposal for new project.',
          fileType: 'application/pdf',
          createdAt: new Date(),
          size: 1234567,
        },
        {
          id: '2',
          fileName: 'Team Meeting Notes',
          description: 'Minutes from weekly team sync.',
          fileType: 'text/plain',
          createdAt: new Date(),
          size: 54321,
        },
        {
          id: '3',
          fileName: 'Marketing Plan Q3',
          description: 'Strategy for Q3 marketing campaigns.',
          fileType: 'application/msword',
          createdAt: new Date(),
          size: 987654,
        },
        {
          id: '4',
          fileName: 'Product Showcase',
          description: 'Presentation for upcoming product launch.',
          fileType: 'image/png',
          createdAt: new Date(),
          size: 2100000,
        },
      ];
      this.loading = false;
      // Example error handling:
      // this.error = 'Failed to load documents. Please try again.';
      // this.loading = false;
    }, 1500);
  }

  viewDocument(event: MouseEvent, document: DocumentModel): void {
    event.stopPropagation();
    this.documentService.reviewDocument(document.id).subscribe({
      next: (res) => {
        console.log(res);
        // window.open(res.data, '_blank');

        this.viewBase64File(res.data, document.fileType);
      },
      error: (err) => {
        console.log(err);
      },
    });

    this.messageService.add({
      severity: 'info',
      summary: 'عرض الملف',
      detail: `عرض الملف: ${document.fileName}`,
    });
  }
  viewBase64File(base64String: string, mimeType: string) {
    try {
      const cleanBase64 = base64String.includes(',')
        ? base64String.split(',')[1]
        : base64String;

      const byteCharacters = atob(cleanBase64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: mimeType });
      const fileURL = URL.createObjectURL(blob);

      // نوع الملف
      const isDisplayable = [
        'application/pdf',
        'image/png',
        'image/jpeg',
        'image/gif',
        'image/webp',
        'audio/mpeg',
        'audio/wav',
        'audio/mp3',
        'video/mp4',
        'video/webm',
        'video/ogg',
      ].includes(mimeType);

      if (isDisplayable) {
        // نعرضه في صفحة جديدة أو iframe
        window.open(fileURL);
      } else {
        // نعمله تحميل لأن المتصفح مش هيعرف يعرضه مباشرة
        const a = document.createElement('a');
        a.href = fileURL;
        a.download = 'file'; // ممكن تحط اسم ديناميكي هنا
        a.click();
      }
    } catch (error) {
      console.error('Error displaying file:', error);
    }
  }

  downloadDocument(event: MouseEvent, documents: DocumentModel): void {
    event.stopPropagation();

    this.documentService.downloadDocument(documents.id).subscribe({
      next: (res) => {
        const blob = res.body!;
        const contentDisposition = res.headers.get('Content-Disposition');
        let filename = 'downloaded-file';

        if (contentDisposition) {
          const matches = /filename="(.+)"/.exec(contentDisposition);
          if (matches && matches[1]) {
            filename = matches[1];
          }
        }

        const url = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.log(err);
      },
    });
    this.messageService.add({
      severity: 'success',
      summary: 'تحميل',
      detail: `بدء تحميل: ${documents.fileName}`,
    });
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  trackByDocId(index: number, doc: any): string {
    return doc.id;
  }
  makeChange(event: MouseEvent, document: DocumentModel)
  {
    if (this.checkFav(document.id)) {
      this.removeFav(document.id)
    }
    else
    {
      this.addTofavourite(document.id)
    }
  }
  addTofavourite( document: string): void {
    this.documentService.addToFavorites(document).subscribe({
      next: (res) => {
         this.fetchPublicDocuments()
        console.log(res);
         this.messageService.add({
      severity: 'success',
      summary: 'add To favourite',
      detail: `add To favourite`,
    });
      },
      error: (res) => {
        console.log(res);
      },
    });
  }
  removeFav(id:string)
  {
    this.documentService.removeFromFavorites(id).subscribe({
      next:(res)=>{
        console.log(res);
        this.fetchPublicDocuments()
         this.messageService.add({
      severity: 'success',
      summary: 'remove From favourite',
      detail: `remove From favourite`,
    });
      },
      error:(err)=>{
        console.log(err);
        
      }
    })
  }
  checkFav(id: string): boolean {
    const exists = this.favouriteDocument.some((f) => f.id === id);

    if (exists) {
      return true;
    } else {
      return false;
    }
  }
}
