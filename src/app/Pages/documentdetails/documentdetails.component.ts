import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

// PrimeNG Imports
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { BadgeModule } from 'primeng/badge';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import { CalendarModule } from 'primeng/calendar';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService, ConfirmationService } from 'primeng/api';
import {
  DocumentDetailDto,
  SharedUser,
  DocumentActivity,
  DocumentTag,
  Privacy,
  UpdateDocumentRequest,
  SharePermission,
  ShareDocumentRequest,
} from '../../Interfaces/Document/document';
import { DocumentdetailsService } from '../../Services/Documentdetails/documentdetails.service';
import { DocumentService } from '../../Services/Document/document.service';
import { TranslateModule } from '@ngx-translate/core';
import { UpdateDocumentComponent } from "../../Component/update-document/update-document.component";

@Component({
  selector: 'app-documentdetails',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    TagModule,
    BadgeModule,
    DialogModule,
    InputTextModule,
    DropdownModule,
    CheckboxModule,
    CalendarModule,
    InputTextareaModule,
    ToastModule,
    ConfirmDialogModule,
    TooltipModule,
    TranslateModule,
    UpdateDocumentComponent
],
  providers: [MessageService, ConfirmationService],
  templateUrl: './documentdetails.component.html',
  styleUrl: './documentdetails.component.scss',
})
export class DocumentdetailsComponent {
  document: DocumentDetailDto | null = null;
  sharedUsers: SharedUser[] = [];
  activities: DocumentActivity[] = [];
  
  // Modal states
  showEditModal = false;
  showShareModal = false;
  updating = false;
  sharing = false;

  // Forms
  editForm: FormGroup;
  shareForm: FormGroup;

  // Options
  tagOptions = [
    { label: 'عام', value: DocumentTag.GENERAL },
    { label: 'مهم', value: DocumentTag.IMPORTANT },
    { label: 'مسودة', value: DocumentTag.DRAFT },
    { label: 'مؤرشف', value: DocumentTag.ARCHIVED },
    { label: 'سري', value: DocumentTag.CONFIDENTIAL },
  ];

  privacyOptions = [
    { label: 'خاص', value: Privacy.PRIVATE },
    { label: 'عام', value: Privacy.PUBLIC },
    { label: 'مشارك', value: Privacy.SHARED },
  ];

  folderOptions: { id: string; name: string }[] = [];
  minDate = new Date();

  private destroy$ = new Subject<void>();
  private documentId: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private fb: FormBuilder,
    private documentDetailService: DocumentdetailsService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private _DocumentService: DocumentService,
    private _Router:Router
  ) {
    this.editForm = this.fb.group({
      title: [''],
      fileName: ['', Validators.required],
      tag: ['', Validators.required],
      privacy: ['', Validators.required],
      folderId: [''],
    });

    this.shareForm = this.fb.group({
      userEmail: ['', [Validators.required, Validators.email]],
      canView: [true],
      canDownload: [false],
      canEdit: [false],
      canShare: [false],
      expiryDate: [''],
      message: [''],
    });
  }

  ngOnInit(): void {
    this.documentId = this.route.snapshot.paramMap.get('id') || '';
    if (this.documentId) {
      this.loadDocumentDetails();
      this.loadSharedUsers();
      this.loadActivities();
      this.loadFolders();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadDocumentDetails(): void {
    this._DocumentService.getDocumentById(this.documentId).subscribe({
      next: (res) => {
        console.log(res);
        this.document = res.data;
        this.populateEditForm();
      },
      error: (err) => {
        console.log(err);
        this.messageService.add({
            severity: 'error',
            summary: 'خطأ',
            detail: 'فشل في تحميل تفاصيل المستند',
          });
      },
    });
  /*  this.documentDetailService
      .getDocumentById(this.documentId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.document = response.data;
          this.populateEditForm();
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'خطأ',
            detail: 'فشل في تحميل تفاصيل المستند',
          });
          console.error(error);
        },
      });*/
  }
editModelChange(event: any) {

  console.log(event);
  
  this.showEditModal=event;
  this.loadDocumentDetails();
}
  loadSharedUsers(): void {
    this.documentDetailService
      .getSharedUsers(this.documentId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.sharedUsers = response.data;
        },
        error: (error) => {
          console.error('Failed to load shared users:', error);
        },
      });
  }

  loadActivities(): void {
    this.documentDetailService
      .getDocumentActivities(this.documentId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.activities = response.data;
        },
        error: (error) => {
          console.error('Failed to load activities:', error);
        },
      });
  }

  loadFolders(): void {
    this.documentDetailService
      .getFolders()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.folderOptions = response.data;
        },
        error: (error) => {
          console.error('Failed to load folders:', error);
        },
      });
  }

  populateEditForm(): void {
    if (this.document) {
      this.editForm.patchValue({
        title: this.document.title,
        fileName: this.document.fileName,
        tag: this.document.tag,
        privacy: this.document.privacy,
        folderId: this.document.folderId,
      });
    }
  }

  showEditDialog(): void {
    this.populateEditForm();
    this.showEditModal = true;
  }

  closeEditDialog(): void {
    this.showEditModal = false;
    this.editForm.reset();
  }

  updateDocument(): void {
    if (this.editForm.valid && this.document) {
      this.updating = true;

      const updateRequest: UpdateDocumentRequest = {
        fileName: this.editForm.value.fileName,
        title: this.editForm.value.title,
        tag: this.editForm.value.tag,
        privacy: this.editForm.value.privacy,
        folderId: this.editForm.value.folderId || undefined,
      };

      this.documentDetailService
        .updateDocument(this.document.id, updateRequest)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            this.messageService.add({
              severity: 'success',
              summary: 'تم التحديث',
              detail: response.message,
            });
            this.loadDocumentDetails();
            this.closeEditDialog();
            this.updating = false;
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'خطأ',
              detail: 'فشل في تحديث المستند',
            });
            this.updating = false;
          },
        });
    }
  }

  showShareDialog(): void {
    this.shareForm.reset({
      canView: true,
      canDownload: false,
      canEdit: false,
      canShare: false,
    });
    this.showShareModal = true;
  }

  closeShareDialog(): void {
    this.showShareModal = false;
    this.shareForm.reset();
  }

  shareDocument(){
    this._DocumentService.shareDocument(this.documentId, this.shareForm.value.userEmail).subscribe({

      next:(res)=>{console.log(res);
              this.messageService.add({
              severity: 'success',
              summary: 'تم المشاركة',
              detail: res.message,
            });
             this.closeShareDialog();
            this.sharing = false;
            this.loadDocumentDetails();

      },
      error:(err)=>{
        console.log(err);
        
      }
    })
  }
 /* shareDocument(): void {
    if (this.shareForm.valid && this.document) {
      this.sharing = true;

      const permissions: SharePermission[] = [];
      if (this.shareForm.value.canView) permissions.push(SharePermission.VIEW);
      if (this.shareForm.value.canDownload)
        permissions.push(SharePermission.DOWNLOAD);
      if (this.shareForm.value.canEdit) permissions.push(SharePermission.EDIT);
      if (this.shareForm.value.canShare)
        permissions.push(SharePermission.SHARE);

      const shareRequest: ShareDocumentRequest = {
        documentId: this.document.id,
        userEmail: this.shareForm.value.userEmail,
        permissions: permissions,
        message: this.shareForm.value.message || undefined,
        expiryDate: this.shareForm.value.expiryDate?.toISOString(),
      };

      this.documentDetailService
        .shareDocument(shareRequest)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            this.messageService.add({
              severity: 'success',
              summary: 'تم المشاركة',
              detail: response.message,
            });
            this.loadSharedUsers();
            this.closeShareDialog();
            this.sharing = false;
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'خطأ',
              detail: 'فشل في مشاركة المستند',
            });
            this.sharing = false;
          },
        });
    }
  }*/

  revokeAccess(user: SharedUser): void {
    this.confirmationService.confirm({
      message: `هل تريد إلغاء مشاركة المستند مع ${user.name}؟`,
      header: 'تأكيد إلغاء المشاركة',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'نعم',
      rejectLabel: 'لا',
      accept: () => {
        this.documentDetailService
          .revokeAccess(this.documentId, user.id)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (response) => {
              this.messageService.add({
                severity: 'success',
                summary: 'تم الإلغاء',
                detail: response.message,
              });
              this.loadSharedUsers();
            },
            error: (error) => {
              this.messageService.add({
                severity: 'error',
                summary: 'خطأ',
                detail: 'فشل في إلغاء المشاركة',
              });
            },
          });
      },
    });
  }

  previewDocument(): void {
  
      this._DocumentService.reviewDocument(this.documentId).subscribe({
        next: (res) => {
          console.log(res);
          // window.open(res.data, '_blank');
  
          this.viewBase64File(res.data, this.document?.fileType!);
        },
        error: (err) => {
          console.log(err);
        },
      });
    
      this.messageService.add({
        severity: 'info',
        summary: 'عرض الملف',
        detail: `عرض الملف: ${this.document?.fileName}`
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
  

  downloadDocument(): void {
    
         this._DocumentService.downloadDocument(this.documentId).subscribe({
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
             this.messageService.add({
              severity: 'success',
              summary: 'تحميل',
              detail: 'تم بدء التحميل',
            });
          },
          error: (err) => {
            console.log(err);
              this.messageService.add({
              severity: 'error',
              summary: 'خطأ',
              detail: 'فشل في تحميل الملف',
            });
          },
        });
        this.messageService.add({
          severity: 'success',
          summary: 'تحميل',
          detail: `بدء تحميل: ${this.document?.fileName}`
        });
      
    
    if (this.document) {
      this.documentDetailService
        .downloadDocument(this.document.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            // Create download link
            const link = document.createElement('a');
            link.href = response.data;
            link.download = this.document!.fileName;
            link.click();

            this.messageService.add({
              severity: 'success',
              summary: 'تحميل',
              detail: 'تم بدء التحميل',
            });
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'خطأ',
              detail: 'فشل في تحميل الملف',
            });
          },
        });
    }
  }

  copyLink(): void {
    if (this.document) {
      navigator.clipboard.writeText(this.document.filePath);
      this.messageService.add({
        severity: 'success',
        summary: 'تم النسخ',
        detail: 'تم نسخ رابط المستند',
      });
    }
  }

  openFolder(): void {
    if (this.document) {
      this.router.navigate(['/folders', this.document.folderId]);
    }
  }

  deleteDocument(): void {
    if (!this.document) return;

    this.confirmationService.confirm({
      message: `هل أنت متأكد من حذف المستند "${this.document.fileName}"؟`,
      header: 'تأكيد الحذف',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'نعم',
      rejectLabel: 'لا',
      accept: () => {
        this._DocumentService.deleteDocument(this.document?.id!).subscribe({
        next:(res)=>{
          console.log(res);
          this._Router.navigate(['/home/Documents']);
           this.messageService.add({
                severity: 'success',
                summary: 'تم الحذف',
                detail: res.message,
              });
        },
        error:(err)=>{
          console.log(err);
           this.messageService.add({
                severity: 'error',
                summary: 'خطأ',
                detail: 'فشل في حذف المستند',
              });
          
        }
       })
        
          
      },
    });
  }

  restoreDocument(): void {
    if (!this.document) return;

    this.confirmationService.confirm({
      message: `هل تريد استعادة المستند "${this.document.fileName}"؟`,
      header: 'تأكيد الاستعادة',
      icon: 'pi pi-question-circle',
      acceptLabel: 'نعم',
      rejectLabel: 'لا',
      accept: () => {
        this.documentDetailService
          .restoreDocument(this.document!.id)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (response) => {
              this.messageService.add({
                severity: 'success',
                summary: 'تم الاستعادة',
                detail: response.message,
              });
              this.loadDocumentDetails();
            },
            error: (error) => {
              this.messageService.add({
                severity: 'error',
                summary: 'خطأ',
                detail: 'فشل في استعادة المستند',
              });
            },
          });
      },
    });
  }

  goBack(): void {
    this.location.back();
  }

  // Utility methods
  trackByUserId(index: number, user: SharedUser): string {
    return user.id;
  }

  trackByActivityId(index: number, activity: DocumentActivity): string {
    return activity.id;
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 بايت';

    const k = 1024;
    const sizes = ['بايت', 'كيلوبايت', 'ميجابايت', 'جيجابايت'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  getFileIcon(fileType: string): string {
    const iconMap: { [key: string]: string } = {
      pdf: 'pi pi-file-pdf',
      doc: 'pi pi-file-word',
      docx: 'pi pi-file-word',
      xls: 'pi pi-file-excel',
      xlsx: 'pi pi-file-excel',
      ppt: 'pi pi-file',
      pptx: 'pi pi-file',
      txt: 'pi pi-file-edit',
      jpg: 'pi pi-image',
      jpeg: 'pi pi-image',
      png: 'pi pi-image',
      gif: 'pi pi-image',
    };
    return iconMap[fileType.toLowerCase()] || 'pi pi-file';
  }

  getFileTypeSeverity(
    fileType: string
  ):
    | 'success'
    | 'info'
    | 'warning'
    | 'danger'
    | 'secondary'
    | 'contrast'
    | undefined {
    const severityMap: { [key: string]: any } = {
      pdf: 'danger',
      doc: 'info',
      docx: 'info',
      xls: 'success',
      xlsx: 'success',
      txt: 'secondary',
      jpg: 'warning',
      jpeg: 'warning',
      png: 'warning',
    };
    return severityMap[fileType.toLowerCase()] || 'secondary';
  }

  getTagLabel(tag: string): string {
    const labelMap: { [key: string]: string } = {
      [DocumentTag.GENERAL]: 'عام',
      [DocumentTag.IMPORTANT]: 'مهم',
      [DocumentTag.DRAFT]: 'مسودة',
      [DocumentTag.ARCHIVED]: 'مؤرشف',
      [DocumentTag.CONFIDENTIAL]: 'سري',
    };
    return labelMap[tag] || tag;
  }

  getTagSeverity(
    tag: string
  ):
    | 'success'
    | 'info'
    | 'warning'
    | 'danger'
    | 'secondary'
    | 'contrast'
    | undefined {
    const severityMap: { [key: string]: any } = {
      [DocumentTag.GENERAL]: 'secondary',
      [DocumentTag.IMPORTANT]: 'warning',
      [DocumentTag.DRAFT]: 'info',
      [DocumentTag.ARCHIVED]: 'contrast',
      [DocumentTag.CONFIDENTIAL]: 'danger',
    };
    return severityMap[tag] || 'secondary';
  }

  getPrivacyLabel(privacy: Privacy): string {
    const labelMap: { [key: string]: string } = {
      [Privacy.PRIVATE]: 'خاص',
      [Privacy.PUBLIC]: 'عام',
      [Privacy.SHARED]: 'مشارك',
    };
    return labelMap[privacy] || privacy;
  }

  getPrivacySeverity(
    privacy: Privacy
  ):
    | 'success'
    | 'info'
    | 'warning'
    | 'danger'
    | 'secondary'
    | 'contrast'
    | undefined {
    const severityMap: { [key: string]: any } = {
      [Privacy.PRIVATE]: 'danger',
      [Privacy.PUBLIC]: 'success',
      [Privacy.SHARED]: 'info',
    };
    return severityMap[privacy] || 'secondary';
  }

  getPrivacyIcon(privacy: Privacy): string {
    const iconMap: { [key: string]: string } = {
      [Privacy.PRIVATE]: 'pi pi-lock',
      [Privacy.PUBLIC]: 'pi pi-globe',
      [Privacy.SHARED]: 'pi pi-users',
    };
    return iconMap[privacy] || 'pi pi-question';
  }

  getPermissionLabel(permission: SharePermission): string {
    const labelMap: { [key: string]: string } = {
      [SharePermission.VIEW]: 'عرض',
      [SharePermission.DOWNLOAD]: 'تحميل',
      [SharePermission.EDIT]: 'تعديل',
      [SharePermission.SHARE]: 'مشاركة',
    };
    return labelMap[permission] || permission;
  }
}
