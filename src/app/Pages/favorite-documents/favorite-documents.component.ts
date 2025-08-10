import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { DocumentService } from '../../Services/Document/document.service';
import { DocumentModel } from '../../Interfaces/Document/document';
import { ThemeService } from '../../Services/Theme/theme.service';

@Component({
  selector: 'app-favorite-documents',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, NgxSpinnerModule],
  templateUrl: './favorite-documents.component.html',
  styleUrls: ['./favorite-documents.component.scss']
})
export class FavoriteDocumentsComponent implements OnInit, OnDestroy {
  favoriteDocuments: DocumentModel[] = [];
  filteredDocuments: DocumentModel[] = [];
  searchTerm: string = '';
  loading: boolean = false;
  isDarkMode: boolean = false;
  private themeSubscription: Subscription = new Subscription();

  constructor(
    private documentService: DocumentService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private themeService: ThemeService
  ) {}

  ngOnInit(): void {
    // Subscribe to theme changes for real-time dark mode toggle
    this.themeSubscription = this.themeService.theme$.subscribe(theme => {
      this.isDarkMode = theme === 'dark';
    });

    this.loadFavoriteDocuments();
  }

  ngOnDestroy(): void {
    // Clean up subscription to prevent memory leaks
    this.themeSubscription.unsubscribe();
  }

  loadFavoriteDocuments(): void {
    this.loading = true;
    this.spinner.show();
    
    this.documentService.getFavoriteDocuments().subscribe({
      next: (response) => {
        console.log(response);
        
        if ( response.data) {
          this.favoriteDocuments = response.data.document;
          this.filteredDocuments = [...this.favoriteDocuments];
        } else {
          this.favoriteDocuments = [];
          this.filteredDocuments = [];
        }
        this.loading = false;
        this.spinner.hide();
      },
      error: (error) => {
        console.error('Error loading favorite documents:', error);
        this.toastr.error('حدث خطأ في تحميل المستندات المفضلة', 'خطأ');
        this.loading = false;
        this.spinner.hide();
      }
    });
  }

  removeFromFavorites(documentId: string): void {
    this.spinner.show();
    
    this.documentService.removeFromFavorites(documentId).subscribe({
      next: (response) => {
     
          this.favoriteDocuments = this.favoriteDocuments.filter(doc => doc.id !== documentId);
          this.filterDocuments();
          this.toastr.success('تم إزالة المستند من المفضلة بنجاح', 'نجح');
      
        this.spinner.hide();
      },
      error: (error) => {
        console.error('Error removing from favorites:', error);
        this.toastr.error('حدث خطأ في إزالة المستند من المفضلة', 'خطأ');
        this.spinner.hide();
      }
    });
  }

  onSearchChange(): void {
    this.filterDocuments();
  }

  filterDocuments(): void {
    if (!this.searchTerm.trim()) {
      this.filteredDocuments = [...this.favoriteDocuments];
    } else {
      this.filteredDocuments = this.favoriteDocuments.filter(doc =>
        doc.fileName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        doc.tag.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        (doc.workspaceName && doc.workspaceName.toLowerCase().includes(this.searchTerm.toLowerCase()))
      );
    }
  }

  /*downloadDocument(documents: DocumentModel): void {
    this.spinner.show();
    
    this.documentService.downloadDocument(documents.id).subscribe({
      next: (response) => {
        
        const blob = response.body!;
        const contentDisposition = response.headers.get('Content-Disposition');
        let filename = documents.fileName;

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
        
        this.toastr.success('تم تحميل المستند بنجاح', 'نجح');
        this.spinner.hide();
      },
      error: (error) => {
        console.error('Error downloading document:', error);
        this.toastr.error('حدث خطأ في تحميل المستند', 'خطأ');
        this.spinner.hide();
      }
    });
  }
*/
downloadDocument(documents: DocumentModel): void {
       
     this.documentService.downloadDocument(documents.id).subscribe({
      next: (res) => {
        const blob = res.body!;
        const contentDisposition = res.headers.get('Content-Disposition');
        let filename = documents.fileName;

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
   
  }
  viewDocument(documentId: string): void {
    // Navigate to document details
  }

  getFileIcon(fileType: string): string {
    const type = fileType.toLowerCase();
    if (type.includes('pdf')) return 'fas fa-file-pdf text-red-500';
    if (type.includes('word') || type.includes('doc')) return 'fas fa-file-word text-blue-500';
    if (type.includes('excel') || type.includes('sheet')) return 'fas fa-file-excel text-green-500';
    if (type.includes('image') || type.includes('jpg') || type.includes('png')) return 'fas fa-file-image text-purple-500';
    return 'fas fa-file text-gray-500';
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  getTagClass(tag: string): string {
    switch (tag.toUpperCase()) {
      case 'IMPORTANT': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'URGENT': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'DRAFT': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'CONFIDENTIAL': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      default: return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    }
  }
}
