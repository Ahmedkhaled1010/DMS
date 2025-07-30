import { CreateDocItemComponent } from '../../Component/Workspace/create-doc-item/create-doc-item.component';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';
import { Subject, takeUntil, combineLatest } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Document, Folder } from '../../Interfaces/Folder/folder';
import { FolderService } from '../../Services/Folder/folder.service';
import { ActivatedRoute } from '@angular/router';
import { WorkspaceService } from '../../Services/Workspace/workspace.service';
import { TranslateModule } from '@ngx-translate/core';
import { DocumentService } from '../../Services/Document/document.service';

@Component({
  selector: 'app-workspace-data',
  standalone: true,
  imports: [CreateDocItemComponent, CommonModule, TranslateModule],
  templateUrl: './workspace-data.component.html',
  styleUrl: './workspace-data.component.scss',
  animations: [
    trigger('slideIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate(
          '300ms ease-out',
          style({ opacity: 1, transform: 'translateY(0)' })
        ),
      ]),
      transition(':leave', [
        animate(
          '300ms ease-in',
          style({ opacity: 0, transform: 'translateY(-20px)' })
        ),
      ]),
    ]),
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('200ms ease-in', style({ opacity: 1 })),
      ]),
      transition(':leave', [animate('200ms ease-out', style({ opacity: 0 }))]),
    ]),
    trigger('slideInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.95)' }),
        animate('200ms ease-out', style({ opacity: 1, transform: 'scale(1)' })),
      ]),
    ]),
  ],
})
export class WorkspaceDataComponent {
  currentFolders: Folder[] = [];
  currentDocuments: Document[] = [];
  currentDocument?: Document;
  currentFolder?: Folder;
  showCreateModal = false;
  createType: 'folder' | 'document' = 'folder';
  loading = false;
  error: string | null = null;
  workspaceId?: string;
  isUpdate: boolean = false;
  isDeleting = false;
  folderId: string = '';
  backFolderId: string = '';
  showDeleteDialog: boolean = false;
  workspace: boolean = true;
  private destroy$ = new Subject<void>();
  private allFolders: Folder[] = [];
  private allDocuments: Document[] = [];

  constructor(
    private fileSystemService: FolderService,
    private toastr: ToastrService,
    private _ActivatedRoute: ActivatedRoute,
    private _WorkspaceService: WorkspaceService,
    private _DocumentService: DocumentService
  ) {}

  ngOnInit(): void {
    this.loadData();
    this.subscribeToModalState();

    this._ActivatedRoute.params.subscribe((res) => {
      this.workspaceId = res['id'];
      //this.getAllFolderWorkspace(res['id']);
    });
    if (this.folderId == '' || this.folderId == undefined) {
      this.getAllFolderWorkspace(this.workspaceId!);
      this.getAllDocumentWorkspace();
    }
    this.fileSystemService.folderCreated.subscribe((res) => {
      if (this.folderId == '' || this.folderId == undefined) {
        this.getAllFolderWorkspace(this.workspaceId!);
        this.getAllDocumentWorkspace();
      } else {
        this.getAllChildernFolder();
        this.getAllDocumentFolder();
      }
      //this.navigateToFolder(this.folderId);
      //this.getAllFolder(this.workspaceId!);
    });

    this._DocumentService.documentCreated.subscribe((res) => {
      if (this.folderId == '' || this.folderId == undefined) {
        this.getAllFolderWorkspace(this.workspaceId!);
        this.getAllDocumentWorkspace();
      } else {
        this.getAllChildernFolder();
        this.getAllDocumentFolder();
      }
    });
    this.getWorkspaceById();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadData(): void {
    this.loading = false;
    this.error = null;
  }
  getWorkspaceById() {
    this._WorkspaceService.getWorkspaceById(this.workspaceId).subscribe({
      next: (res) => {
        console.log(res);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  subscribeToModalState(): void {
    this.fileSystemService.isCreateModalOpen
      .pipe(takeUntil(this.destroy$))
      .subscribe((isOpen) => {
        this.showCreateModal = isOpen;
        if (!isOpen) {
          this.loadData(); // Refresh data when modal closes
        }
      });

    this.fileSystemService.createType
      .pipe(takeUntil(this.destroy$))
      .subscribe((type) => {
        this.createType = type;
      });
  }

  updateCurrentView(): void {
    const currentFolderId = this.currentFolder?.id;
    this.getAllDocumentFolder();
    this.getAllChildernFolder();
  }

  navigateToFolder(file: any, folderId?: string): void {
    this.backFolderId = this.folderId!;
    this.folderId = folderId!;

    if (folderId != '') {
      this.updateCurrentView();
      this.workspace = true;
      //  this.currentFolder = this.allFolders.find(f => f.id === folderId);
    } else if (folderId == '') {
      this.workspace = false;
      this.getAllFolderWorkspace(this.workspaceId!);
      this.getAllDocumentWorkspace();
    }
  }

  createNewFolder(type: string): void {
    this.fileSystemService.createType.next('folder');
    this.fileSystemService.isCreateModalOpen.next(true);
    this.isUpdate = false;
    console.log(this.folderId);

    if (type == 'folder') {
      console.log(type);

      this.fileSystemService.folderId.next(this.folderId);
    } else {
      console.log(type);

      this.fileSystemService.folderId.next('');
    }
  }

  createNewDocument(type: string): void {
    this.fileSystemService.createType.next('document');
    this.fileSystemService.isCreateModalOpen.next(true);
    if ((type = 'folder')) {
      this.fileSystemService.folderId.next(this.folderId);
    } else {
      this.fileSystemService.folderId.next('');
    }
  }

  editFolder(folder: Folder, event: Event): void {
    event.stopPropagation();
    // Implement edit functionality
    console.log(this.currentFolder);

    this.isUpdate = true;
    this.fileSystemService.isCreateModalOpen.next(true);
    this.fileSystemService.folderId.next(folder.id);
  }
  deleteFolder(folder: Folder, event: Event): void {
    event.stopPropagation();
    this.currentFolder = folder;
    this.createType = 'folder';

    this.showDeleteDialog = true;
  }
  confirmDelete() {
    console.log(this.backFolderId);
    console.log(this.folderId);

    if (this.createType === 'folder') {
      this.fileSystemService.deleteFolder(this.currentFolder?.id!).subscribe({
        next: (res) => {
          console.log(res);
          this.showDeleteDialog = false;
          console.log(this.backFolderId);
          if (this.backFolderId == undefined) {
            this.navigateToFolder(this.currentFolder, '');
          } else {
            this.navigateToFolder(this.currentFolder, this.backFolderId);
          }
        },
        error: (err) => {
          console.log(err);
          this.showDeleteDialog = false;
          this.toastr.error(err.message);
        },
      });
    } else {
      this._DocumentService.deleteDocument(this.currentDocument!.id).subscribe({
        next: (res) => {
          console.log(res);
          this._DocumentService.documentCreated.next(true);
          this.showDeleteDialog = false;
        },
        error: (err) => {
          console.log(err);
          this.showDeleteDialog = false;
          this.toastr.error(err.message);
        },
      });
    }
  }
  getAllFolderWorkspace(id: string) {
    this._WorkspaceService.getAllFolderInWorkspace(id).subscribe({
      next: (res) => {
        const response: any = res;
        console.log(res);
        this.currentFolders = response.data;
        console.log(this.currentFolders);
      },
      error: (err) => {
        console.log(err);
        this.currentFolders = [];
      },
    });
  }
  getAllDocumentWorkspace() {
    this._DocumentService.getAllDocumentWorkspace(this.workspaceId!).subscribe({
      next: (res) => {
        console.log(res);
        this.currentDocuments = res.data;
      },
      error: (err) => {
        console.log(err);
        this.currentDocuments = [];
      },
    });
  }
  getAllDocumentFolder() {
    this._DocumentService.getAllDocumentFolder(this.folderId).subscribe({
      next: (res) => {
        console.log(res);
        this.currentDocuments = res.data;
      },
      error: (err) => {
        console.log(err);
        this.currentDocuments = [];
      },
    });
  }
  getAllChildernFolder() {
    this.fileSystemService.getChildernFolder(this.folderId).subscribe({
      next: (res) => {
        console.log(res);
        this.currentFolders = res.data;
      },
      error: (err) => {
        console.log(err);
        this.currentFolders = [];
      },
    });
  }

  viewDocument(document: Document): void {
    this._DocumentService.reviewDocument(document.id).subscribe({
      next: (res) => {
        console.log(res);
        // window.open(res.data, '_blank');

        this.viewBase64File(res.data, document.fileType);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  fixBase64Padding(base64: string): string {
    const remainder = base64.length % 4;
    if (remainder === 2) return base64 + '==';
    if (remainder === 3) return base64 + '=';
    if (remainder === 1) throw new Error('Invalid base64 string');
    return base64;
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

  downloadDocument(documents: Document) {
    this._DocumentService.downloadDocument(documents.id).subscribe({
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
  }
  editDocument(document: Document): void {
    // Implement document editing
    this.toastr.info('ميزة تعديل المستند قيد التطوير');
  }

  deleteDocument(document: Document): void {
    this.showDeleteDialog = true;
    this.createType = 'document';
    this.currentDocument = document;

    /* if (confirm('هل أنت متأكد من حذف هذا المستند؟')) {
      this.fileSystemService
        .deleteDocument(documentId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            this.toastr.success(response.message);
            this.loadData();
          },
          error: (error) => {
            this.toastr.error('فشل في حذف المستند');
            console.error(error);
          },
        });
    }*/
  }

  closeCreateModal(): void {
    this.showCreateModal = false;
  }

  trackByItemId(index: number, item: Folder | Document): string {
    return item.id;
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 بايت';

    const k = 1024;
    const sizes = ['بايت', 'كيلوبايت', 'ميجابايت', 'جيجابايت'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}
