import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';

// PrimeNG Imports
import { TableModule, TableLazyLoadEvent } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { TagModule } from 'primeng/tag';
import { BadgeModule } from 'primeng/badge';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { InputNumberModule } from 'primeng/inputnumber';
import { SplitButtonModule } from 'primeng/splitbutton';
import { TooltipModule } from 'primeng/tooltip';
import { MenuModule } from 'primeng/menu';
import { PaginatorModule } from 'primeng/paginator';
import { MessageService, ConfirmationService, MenuItem } from 'primeng/api';
import { Menu } from 'primeng/menu';

import { DocumentModel, Privacy, DocumentTag, DocumentFilter } from '../../Interfaces/Document/document';
import { DocumentService } from '../../Services/Document/document.service';
import { TranslateModule } from '@ngx-translate/core';
import { FileuploadComponent } from "../../Component/fileupload/fileupload.component";

@Component({
  selector: 'app-all-document',
  standalone: true,
   imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    CalendarModule,
    TagModule,
    BadgeModule,
    ToastModule,
    ConfirmDialogModule,
    ProgressSpinnerModule,
    InputNumberModule,
    SplitButtonModule,
    TooltipModule,
    MenuModule,
    PaginatorModule,
    TranslateModule,
    FileuploadComponent
],
  providers: [MessageService, ConfirmationService],
  templateUrl: './all-document.component.html',
  styleUrl: './all-document.component.scss'
})
export class AllDocumentComponent {
   @ViewChild('mobileMenu') mobileMenu!: Menu;

  documents: DocumentModel[] = [];
  loading = false;
  totalRecords = 0;
  pageSize = 10;
  currentPage = 2;
  sortField = 'createdAt';
  sortOrder = -1;
  visable: boolean = false;
  // Mobile responsive properties
  showMobileFilters = false;
  showTableView = true;
  mobileMenuItems: MenuItem[] = [];
  selectedMobileDocument: DocumentModel | null = null;

  // Statistics
  activeFilesCount = 0;
  deletedFilesCount = 0;
  totalSize = 0;

  // Search and Filters
  searchTerm = '';
  selectedFileType: string | null = null;
  selectedTag: string | null = null;
  selectedPrivacy: Privacy | null = null;
  selectedWorkspace: string | null = null;
  selectedStatus: boolean | null = null;
  minSize: number | null = null;
  maxSize: number | null = null;
  dateRange: Date[] | null = null;

  // Options for dropdowns
  fileTypeOptions: { label: string; value: string }[] = [];
  /*tagOptions = [
    { label: 'عام', value: DocumentTag.GENERAL },
    { label: 'مهم', value: DocumentTag.IMPORTANT },
    { label: 'مسودة', value: DocumentTag.DRAFT },
    { label: 'مؤرشف', value: DocumentTag.ARCHIVED },
    { label: 'سري', value: DocumentTag.CONFIDENTIAL }
  ];*/
    tagOptions: { label: string; value: string }[] = [];

  privacyOptions = [
    { label: 'PRIVATE', value: Privacy.PRIVATE },
    { label: 'PUBLIC', value: Privacy.PUBLIC },
    { label: 'SHARED', value: Privacy.SHARED }
  ];
  workspaceOptions: { id: string; name: string }[] = [];
  statusOptions = [
    { label: 'نشط', value: false },
    { label: 'محذوف', value: true }
  ];

  private destroy$ = new Subject<void>();
  private searchSubject = new Subject<string>();

  constructor(
    private documentService: DocumentService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    // Setup search debouncing
    this.searchSubject.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.loadDocuments();
    });

    // Check initial screen size
    this.checkScreenSize();
    
    // Listen for window resize
    window.addEventListener('resize', () => {
      this.checkScreenSize();
    });
  }

  ngOnInit(): void {
    this.loadDocuments();

    
     
    
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    window.removeEventListener('resize', this.checkScreenSize);
  }

  private checkScreenSize(): void {
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      this.showTableView = false;
      this.showMobileFilters = false;
    } else {
      this.showTableView = true;
      this.showMobileFilters = true;
    }
  }

  toggleMobileFilters(): void {
    this.showMobileFilters = !this.showMobileFilters;
  }

  toggleView(): void {
    this.showTableView = !this.showTableView;
  }

  /*showMobileMenu(event: Event, document: DocumentModel): void {
    this.selectedMobileDocument = document;
    this.mobileMenuItems = [
      {
        label: 'عرض',
        icon: 'pi pi-eye',
        command: () => this.viewDocument(document)
      },
      {
        label: 'تحميل',
        icon: 'pi pi-download',
        command: () => this.downloadDocument(document)
      },
      {
        separator: true
      },
      {
        label: document.isDeleted ? 'استعادة' : 'حذف',
        icon: document.isDeleted ? 'pi pi-refresh' : 'pi pi-trash',
      //  command: () => document.isDeleted ? this.restoreDocument(document) : this.deleteDocument(document)
      },
      {
        label: 'تغيير الخصوصية',
        icon: 'pi pi-shield',
        items: [
          {
            label: 'خاص',
            icon: 'pi pi-lock',
            command: () => this.updatePrivacy(document, Privacy.PRIVATE)
          },
          {
            label: 'عام',
            icon: 'pi pi-globe',
            command: () => this.updatePrivacy(document, Privacy.PUBLIC)
          },
          {
            label: 'مشارك',
            icon: 'pi pi-users',
            command: () => this.updatePrivacy(document, Privacy.SHARED)
          }
        ]
      }
    ];
    this.mobileMenu.toggle(event);
  }*/

  onMobilePageChange(event: any): void {
    this.currentPage = event.page + 1;
    this.pageSize = event.rows;
    this.loadDocuments();
  }

  getTableHeight(): string {
    const isMobile = window.innerWidth < 768;
    return isMobile ? '400px' : '600px';
  }

  getColspan(): number {
    const screenWidth = window.innerWidth;
    if (screenWidth >= 1536) return 11; // 2xl
    if (screenWidth >= 1280) return 9;  // xl
    if (screenWidth >= 1024) return 7;  // lg
    if (screenWidth >= 768) return 5;   // md
    if (screenWidth >= 640) return 3;   // sm
    return 2; // mobile
  }

  trackByDocumentId(index: number, document: DocumentModel): string {
    return document.id;
  }

  loadInitialData(): void {
    // Load file types
    console.log(this.documents);
    
    const uniqueFileTypes = Array.from(
    new Set(this.documents.map(doc => doc.fileType))
  );

  this.fileTypeOptions = uniqueFileTypes.map(type => ({
    label: type.toUpperCase(),
    value: type
  }));
   const uniqueFileTags = Array.from(
    new Set(this.documents.map(doc => doc.tag))
  );

  this.tagOptions = uniqueFileTags.map(tag => ({
    label: tag.toUpperCase(),
    value: tag
  }));
   const uniqueWorkspacesMap = new Map<string, string>();

  this.documents.forEach(doc => {
    if (doc.workspaceId && doc.workspaceName) {
      uniqueWorkspacesMap.set(doc.workspaceId, doc.workspaceName);
    }
  });

  this.workspaceOptions = Array.from(uniqueWorkspacesMap.entries()).map(
    ([id, name]) => ({ id, name })
  );
  }

  loadDocuments(): void {
    this.loading = true;

    const filter: DocumentFilter = {
      fileName: this.searchTerm || undefined,
      fileType: this.selectedFileType || undefined,
      tag: this.selectedTag || undefined,
      privacy: this.selectedPrivacy || undefined,
      workspaceId: this.selectedWorkspace || undefined,
      isDeleted: this.selectedStatus !== null ? this.selectedStatus : undefined,
      pageNum:this.currentPage!==null?this.currentPage:1,
      pageSize:this.pageSize!==null ?this.pageSize:10,
      sortDirection:this.sortOrder===1?'asc' : 'desc',
      sortField:this.sortField!==null?this.sortField:"fileName",
     minSize: this.minSize ? this.minSize  : undefined,
      maxSize: this.maxSize ? this.maxSize  : undefined,
      /* dateFrom: this.dateRange?.[0]?.toISOString(),
      dateTo: this.dateRange?.[1]?.toISOString()*/
    };
//   console.log(this.documentService.changeToformData(filter));
this.documentService.getAllDocumentUser(filter).subscribe(
  {
    next:(res)=>{
      console.log(res);
       this.documents = res.data;
         this.totalRecords = res.totalElements;
            this.loadInitialData();

        this.updateStatistics();
                this.loading = false;

    },
    error:(err)=>{
      console.log(err);
      
    }
  }
)
   
  
  }

  onLazyLoad(event: TableLazyLoadEvent): void {
    this.currentPage = Math.floor((event.first || 0) / (event.rows || 10)) + 1;
    this.pageSize = event.rows || 10;
    this.sortField = event.sortField as string || 'createdAt';
    this.sortOrder = event.sortOrder || -1;
    
    this.loadDocuments();
  }

  onSearchChange(): void {
    this.searchSubject.next(this.searchTerm);
  }

  onFilterChange(): void {
    this.currentPage = 1;
    this.loadDocuments();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedFileType = null;
    this.selectedTag = null;
    this.selectedPrivacy = null;
    this.selectedWorkspace = null;
    this.selectedStatus = null;
    this.minSize = null;
    this.maxSize = null;
    this.dateRange = null;
    this.currentPage = 1;
    this.loadDocuments();
  }

  get hasActiveFilters(): boolean {
    return !!(
      this.searchTerm ||
      this.selectedFileType ||
      this.selectedTag ||
      this.selectedPrivacy ||
      this.selectedWorkspace ||
      this.selectedStatus !== null ||
      this.minSize ||
      this.maxSize ||
      this.dateRange
    );
  }

  refreshData(): void {
    this.loadDocuments();
    this.messageService.add({
      severity: 'success',
      summary: 'تم التحديث',
      detail: 'تم تحديث البيانات بنجاح'
    });
  }

  addNewDocument(): void {
   this.visable = true;
  }
  uploadedDocument(event:any): void {
      this.visable = event;
    this.loadDocuments();
  }
  viewDocument(event:MouseEvent, document: DocumentModel): void {
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
      detail: `عرض الملف: ${document.fileName}`
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


  downloadDocument(event:MouseEvent,documents: DocumentModel): void {
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
      detail: `بدء تحميل: ${documents.fileName}`
    });
  }

  deleteDocument(event:MouseEvent,document: DocumentModel): void {
        event.stopPropagation();

    this.confirmationService.confirm({
      message: `هل أنت متأكد من حذف الملف "${document.fileName}"؟`,
      header: 'تأكيد الحذف',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'نعم',
      rejectLabel: 'لا',
      accept: () => {
       this.documentService.deleteDocument(document.id).subscribe({
        next:(res)=>{
          console.log(res);
          this.loadDocuments();
        },
        error:(err)=>{
          console.log(err);
          
        }
       })
       
      }
    });
  }

  /*restoreDocument(document: DocumentModel): void {
    this.confirmationService.confirm({
      message: `هل تريد استعادة الملف "${document.fileName}"؟`,
      header: 'تأكيد الاستعادة',
      icon: 'pi pi-question-circle',
      acceptLabel: 'نعم',
      rejectLabel: 'لا',
      accept: () => {
        this.documentService.restoreDocument(document.id)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (response) => {
              this.messageService.add({
                severity: 'success',
                summary: 'تم الاستعادة',
                detail: response.message
              });
              this.loadDocuments();
            },
            error: () => {
              this.messageService.add({
                severity: 'error',
                summary: 'خطأ',
                detail: 'فشل في استعادة الملف'
              });
            }
          });
      }
    });
  }

 /* getActionMenuItems(document: DocumentModel): MenuItem[] {
    return [
      {
        label: 'تغيير الخصوصية',
        icon: 'pi pi-shield',
        items: [
          {
            label: 'خاص',
            icon: 'pi pi-lock',
            command: () => this.updatePrivacy(document, Privacy.PRIVATE)
          },
          {
            label: 'عام',
            icon: 'pi pi-globe',
            command: () => this.updatePrivacy(document, Privacy.PUBLIC)
          },
          {
            label: 'مشارك',
            icon: 'pi pi-users',
            command: () => this.updatePrivacy(document, Privacy.SHARED)
          }
        ]
      },
      {
        label: 'نسخ الرابط',
        icon: 'pi pi-copy',
        command: () => this.copyLink(document)
      },
      {
        label: 'تفاصيل الملف',
        icon: 'pi pi-info-circle',
        command: () => this.showDetails(document)
      }
    ];
  }

  /*updatePrivacy(document: DocumentModel, privacy: Privacy): void {
    this.documentService.updateDocumentPrivacy(document.id, privacy)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'تم التحديث',
            detail: response.message
          });
          this.loadDocuments();
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'خطأ',
            detail: 'فشل في تحديث الخصوصية'
          });
        }
      });
  }
*/
  copyLink(document: DocumentModel): void {
    navigator.clipboard.writeText(document.filePath);
    this.messageService.add({
      severity: 'success',
      summary: 'تم النسخ',
      detail: 'تم نسخ رابط الملف'
    });
  }

  showDetails(document: DocumentModel): void {
    this.messageService.add({
      severity: 'info',
      summary: 'تفاصيل الملف',
      detail: `عرض تفاصيل: ${document.fileName}`
    });
  }

  private updateStatistics(): void {
    this.activeFilesCount = this.documents.filter(d => !d.isDeleted).length;
    this.deletedFilesCount = this.documents.filter(d => d.isDeleted).length;
    this.totalSize = this.documents.reduce((sum, doc) => sum + doc.size, 0);
  }

  // Utility methods for display
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 بايت';
    
    const k = 1024;
    const sizes = ['بايت', 'كيلوبايت', 'ميجابايت', 'جيجابايت'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  getFileIcon(fileType: string): string {
    const iconMap: { [key: string]: string } = {
      'application/pdf': 'pi pi-file-pdf',
      'text/plain': 'pi pi-file-word',
      'docx': 'pi pi-file-word',
      'xls': 'pi pi-file-excel',
      'xlsx': 'pi pi-file-excel',
      'ppt': 'pi pi-file',
      'pptx': 'pi pi-file',
      'txt': 'pi pi-file-edit',
      'image/jpg': 'pi pi-image',
      'image/jpeg': 'pi pi-image',
      'image/png': 'pi pi-image',
      'image/gif': 'pi pi-image'
    };
    return iconMap[fileType.toLowerCase()] || 'pi pi-file';
  }

  getFileTypeSeverity(fileType: string): 'success' | 'info' | 'warning' | 'danger' | 'secondary' | 'contrast' | undefined {
    const severityMap: { [key: string]: any } = {
      'pdf': 'danger',
      'doc': 'info',
      'docx': 'info',
      'xls': 'success',
      'xlsx': 'success',
      'txt': 'secondary',
      'jpg': 'warning',
      'jpeg': 'warning',
      'png': 'warning'
    };
    return severityMap[fileType.toLowerCase()] || 'secondary';
  }

  getTagLabel(tag: string): string {
    const labelMap: { [key: string]: string } = {
      [DocumentTag.GENERAL]: 'عام',
      [DocumentTag.IMPORTANT]: 'مهم',
      [DocumentTag.DRAFT]: 'مسودة',
      [DocumentTag.ARCHIVED]: 'مؤرشف',
      [DocumentTag.CONFIDENTIAL]: 'سري'
    };
    return labelMap[tag] || tag;
  }

  getTagSeverity(tag: string): 'success' | 'info' | 'warning' | 'danger' | 'secondary' | 'contrast' | undefined {
    const severityMap: { [key: string]: any } = {
      [DocumentTag.GENERAL]: 'secondary',
      [DocumentTag.IMPORTANT]: 'warning',
      [DocumentTag.DRAFT]: 'info',
      [DocumentTag.ARCHIVED]: 'contrast',
      [DocumentTag.CONFIDENTIAL]: 'danger'
    };
    return severityMap[tag] || 'secondary';
  }

  getPrivacyLabel(privacy: Privacy): string {
    const labelMap: { [key: string]: string } = {
      [Privacy.PRIVATE]: 'خاص',
      [Privacy.PUBLIC]: 'عام',
      [Privacy.SHARED]: 'مشارك'
    };
    return labelMap[privacy] || privacy;
  }

  getPrivacySeverity(privacy: Privacy): 'success' | 'info' | 'warning' | 'danger' | 'secondary' | 'contrast' | undefined {
    const severityMap: { [key: string]: any } = {
      [Privacy.PRIVATE]: 'danger',
      [Privacy.PUBLIC]: 'success',
      [Privacy.SHARED]: 'info'
    };
    return severityMap[privacy] || 'secondary';
  }

  getPrivacyIcon(privacy: Privacy): string {
    const iconMap: { [key: string]: string } = {
      [Privacy.PRIVATE]: 'pi pi-lock',
      [Privacy.PUBLIC]: 'pi pi-globe',
      [Privacy.SHARED]: 'pi pi-users'
    };
    return iconMap[privacy] || 'pi pi-question';
  }
}
