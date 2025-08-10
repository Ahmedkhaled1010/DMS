import { Component,  OnInit,  OnDestroy } from "@angular/core"
import  { ActivatedRoute, Router } from "@angular/router"
import {  FormBuilder,  FormGroup, Validators } from "@angular/forms"
import { ConfirmationService, MessageService } from "primeng/api"
import { Subject } from "rxjs"
import { takeUntil } from "rxjs/operators"

// PrimeNG Imports
import { ToastModule } from "primeng/toast"
import { ConfirmDialogModule } from "primeng/confirmdialog"
import { CardModule } from "primeng/card"
import { ButtonModule } from "primeng/button"
import { ProgressSpinnerModule } from "primeng/progressspinner"
import { TabViewModule } from "primeng/tabview"
import { DropdownModule } from "primeng/dropdown"
import { PaginatorModule } from "primeng/paginator"
import { DialogModule } from "primeng/dialog"
import { InputTextModule } from "primeng/inputtext"
import { InputTextareaModule } from "primeng/inputtextarea"
import { TooltipModule } from "primeng/tooltip"

// Angular Common Imports
import { CommonModule } from "@angular/common"
import { ReactiveFormsModule, FormsModule } from "@angular/forms"
import { RouterModule } from "@angular/router"
import { FolderService } from "../../../Services/Folder/folder.service"
import { DocumentService } from "../../../Services/Document/document.service"
import { Document, DocumentModel } from "../../../Interfaces/Document/document"
import { TranslateModule } from "@ngx-translate/core"
import { FileuploadComponent } from "../../../Component/fileupload/fileupload.component";

interface FolderDetails {
  id: string
  name: string
  description?: string
  parentId: string
  parentType: string
  createdAt: Date
  updatedAt: Date
  createdBy?: string
  permissions?: string,
   parentName?:string;
  workspaceName?:string;
  documents:DocumentModel[]
}

interface SubFolder {
  id: string
  name: string
  description?: string
  documentsCount: number
  updatedAt: Date
}



interface Activity {
  id: string
  type: "create" | "edit" | "delete" | "upload"
  title: string
  description: string
  timestamp: Date
  user?: string
}

@Component({
  selector: 'app-folderdetails',
  standalone: true,
   imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    ToastModule,
    ConfirmDialogModule,
    CardModule,
    ButtonModule,
    ProgressSpinnerModule,
    TabViewModule,
    DropdownModule,
    PaginatorModule,
    DialogModule,
    InputTextModule,
    InputTextareaModule,
    TooltipModule,
    TranslateModule,
    FileuploadComponent
], providers: [ConfirmationService, MessageService],
  templateUrl: './folderdetails.component.html',
  styleUrl: './folderdetails.component.scss'
})

export class FolderdetailsComponent {
private destroy$ = new Subject<void>()

  // Theme Management
  currentTheme: "light" | "dark" = "light"
  visable: boolean = false;

  // Folder Data
  folderId = ""
  folderDetails: FolderDetails | null = null

  // Sub Folders
  subFolders: FolderDetails[] = []
  subFoldersCount = 0
  loadingSubFolders = false

  // Documents
  documents: DocumentModel[] = []
  documentsCount = 0
  totalDocuments = 0
  documentsPerPage = 10
  firstDocument = 0
  loadingDocuments = false
  selectedView: "grid" | "list" = "grid"

  // Activities
  activities: Activity[] = []

  // View Options
  viewOptions = [
    { label: "شبكة", value: "grid" },
    { label: "قائمة", value: "list" },
  ]
  isNew:boolean= false;
  // Dialog States
  showEditDialog = false
isUploading = false
  uploadProgress = 0
  // Forms
  editForm: FormGroup

  // Pagination
  first = 0
  rows = 10

  // Loading states
  loading = false
  error: string | null = null

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private folderService: FolderService,
    private documentService: DocumentService,
    private _Router:Router
  ) {
    this.editForm = this.fb.group({
      name: ["", Validators.required],
      description: [""],
    })
  }

  ngOnInit(): void {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.folderId = params["id"]
      this.loadFolderDetails()
      this.loadSubFolders()
      this.loadDocuments()
      this.loadActivities()
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

  // Theme Management
  
  // Navigation
  goBack(): void {
    this.router.navigate(["/home/Folders"])
  }

  // Data Loading Methods
  loadFolderDetails(): void {
    this.loading = true
    this.error = null
     this.folderService.getFolderById(this.folderId).subscribe({
      next: (res) => {
        this.folderDetails = res.data
        this.loading = false
      },
      error: (err) => {
        this.loading = false
        this.error = "فشل في تحميل تفاصيل المجلد"
        console.error("Error loading folder details:", err)
      } });
    // Simulate API call
  
  }

  loadSubFolders(): void {
    this.loadingSubFolders = true
    this.folderService.getChildernFolder(this.folderId).subscribe({
      next: (res) => {
        this.subFolders = res.data
        this.subFoldersCount = this.subFolders.length
        this.loadingSubFolders = false
      },
      error: (err) => {
        this.loadingSubFolders = false
        console.error("Error loading subfolders:", err)
      }
    })
    // Simulate API call
    
  }

  loadDocuments(): void {
    this.loadingDocuments = true
   this.documentService.getAllDocumentFolder(this.folderId).subscribe({
      next: (res) => {
        this.documents = res.data
        this.documentsCount = this.documents.length
        this.totalDocuments = this.documents.length
        this.loadingDocuments = false
      },
      error: (err) => {
        this.loadingDocuments = false
        this.error = "فشل في تحميل المستندات"
        console.error("Error loading documents:", err)
      }});    // Simulate API call
    
  }

  loadActivities(): void {
    // Simulate API call
    setTimeout(() => {
      this.activities = [
        {
          id: "1",
          type: "upload",
          title: "رفع مستند جديد",
          description: 'تم رفع ملف "تقرير المشروع الأول.pdf"',
          timestamp: new Date("2024-01-19T10:30:00"),
          user: "أحمد محمد",
        },
        {
          id: "2",
          type: "edit",
          title: "تعديل مجلد فرعي",
          description: 'تم تعديل اسم المجلد "المشاريع الجارية"',
          timestamp: new Date("2024-01-18T14:15:00"),
          user: "سارة أحمد",
        },
        {
          id: "3",
          type: "create",
          title: "إنشاء مجلد فرعي",
          description: 'تم إنشاء مجلد جديد "المشاريع المؤجلة"',
          timestamp: new Date("2024-01-17T09:45:00"),
          user: "محمد علي",
        },
      ]
    }, 600)
  }

  // Utility Methods
  getParentName(parentId: string, parentType: string): string {
    if (parentType === "workspace") {
      return "مساحة العمل الرئيسية"
    }
    return "مجلد أب"
  }

  calculateFolderSize(): string {
    const totalSize = this.documents.reduce((sum, doc) => sum + doc.size, 0)
    return this.formatFileSize(totalSize)
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 بايت"
    const k = 1024
    const sizes = ["بايت", "كيلوبايت", "ميجابايت", "جيجابايت"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  getDocumentIcon(type: string): string {
    const iconMap: { [key: string]: string } = {
      pdf: "pi pi-file-pdf",
      doc: "pi pi-file-word",
      docx: "pi pi-file-word",
      xls: "pi pi-file-excel",
      xlsx: "pi pi-file-excel",
      ppt: "pi pi-file",
      pptx: "pi pi-file",
      txt: "pi pi-file",
      default: "pi pi-file",
    }
    return iconMap[type] || iconMap["default"]
  }

  getDocumentIconClass(type: string): string {
    return type.toLowerCase();
  }

  getActivityIcon(type: string): string {
    const iconMap: { [key: string]: string } = {
      create: "pi pi-plus",
      edit: "pi pi-pencil",
      delete: "pi pi-trash",
      upload: "pi pi-upload",
    }
    return iconMap[type] || "pi pi-info-circle"
  }

  getActivityIconClass(type: string): string {
    return type
  }

  // Action Methods
  editFolder(): void {
    this.isNew= false;
    if (this.folderDetails) {
      this.editForm.patchValue({
        name: this.folderDetails.name,
        description: this.folderDetails.description || "",
      })

      this.showEditDialog = true
    }
  }

  saveChanges(): void {
    console.log("Saving changes to folder:", this.editForm.value);
   if (!this.isNew) {
     this.folderService.updateFolder(this.folderId, this.editForm.value).subscribe({

      next:(res)=>{
        console.log(res);
         this.messageService.add({
          severity: "success",
          summary: "تم بنجاح",
          detail: "تم تحديث بيانات المجلد بنجاح",
        })

        this.showEditDialog = false
        
      },
      error: (err) => {
        console.log(err);
        
      }
    })
   
   }
   else{
    
    this.folderService.createFolderInParent( this.editForm.value,this.folderId).subscribe({

      next:(res)=>{
        console.log(res);
         this.messageService.add({
          severity: "success",
          summary: "تم بنجاح",
          detail: "تم إضافة المجلد الفرعي بنجاح",
        })
        this.showEditDialog = false
        this.fetchFolders()
      },
      error: (err) => {
        console.error("Error creating subfolder:", err)
        this.messageService.add({
          severity: "error",
          summary: "خطأ",
          detail: "فشل في إضافة المجلد الفرعي",
        })
      }
    })
    
   }
    
  }

  confirmDeleteFolder(event: Event): void {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: "هل أنت متأكد من حذف هذا المجلد؟ سيتم حذف جميع المحتويات.",
      header: "تأكيد الحذف",
      icon: "pi pi-exclamation-triangle",
      acceptLabel: "حذف",
      rejectLabel: "إلغاء",
      acceptButtonStyleClass: "p-button-danger",
      accept: () => {
        this.deleteFolder()
      },
    })
  }

  deleteFolder(): void {
    this.folderService.deleteFolder(this.folderId).subscribe({
      next:(res)=>{
        console.log(res);
         this.messageService.add({
        severity: "success",
        summary: "تم بنجاح",
        detail: "تم حذف المجلد بنجاح",
      })
      this.router.navigate(["/home/Folders"])
      },
      error: (err) => {
        console.error("Error deleting folder:", err)
        this.messageService.add({
          severity: "error",
          summary: "خطأ",
          detail: "فشل في حذف المجلد",
        })
      }
    })
    // Simulate API call
  
  }

  addSubFolder(): void {
          this.showEditDialog = true
          this.isNew=true;

    // Navigate to add sub folder or open dialog
    console.log("إضافة مجلد فرعي")
  }

  openFolder(folderId: string): void {
    this.router.navigate(["/home/folderDetails", folderId])
  }

  editSubFolder(event: Event, folder: SubFolder): void {
    event.stopPropagation()
        this.router.navigate(["/home/folderDetails", folder.id])

    console.log("تعديل المجلد الفرعي:", folder)
  }

  deleteSubFolder(event: Event, folder: FolderDetails): void {
    event.stopPropagation()
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: `هل أنت متأكد من حذف المجلد "${folder.name}"؟`,
      header: "تأكيد الحذف",
      icon: "pi pi-exclamation-triangle",
      acceptLabel: "حذف",
      rejectLabel: "إلغاء",
      acceptButtonStyleClass: "p-button-danger",
      accept: () => {
        // Simulate API call
       this.folderService.deleteFolder(folder.id).subscribe({
      next:(res)=>{
        console.log(res);
         this.messageService.add({
        severity: "success",
        summary: "تم بنجاح",
        detail: "تم حذف المجلد بنجاح",
      })
      this.fetchFolders()
    },
      error: (err) => {
        console.error("Error deleting folder:", err)
        this.messageService.add({
          severity: "error",
          summary: "خطأ",
          detail: "فشل في حذف المجلد",
        })
      }
    })
      },
    })
  }

  uploadDocument(): void {
    this.visable = true;
    console.log("رفع مستند")
  }

  changeView(event: any): void {
    this.selectedView = event.value
  }

  downloadDocument(doc: DocumentModel): void {
     this.documentService.downloadDocument(doc.id).subscribe({
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
          detail: `بدء تحميل: ${doc.fileName}`
        });
      
    console.log("تحميل المستند:", doc)
  }

  editDocument(doc: DocumentModel): void {
    this.router.navigate(["/home/Documentdetails", doc.id])
    console.log("تعديل المستند:", doc)
  }

  deleteDocument(event: Event, doc: DocumentModel): void {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: `هل أنت متأكد من حذف المستند "${doc.fileName}"؟`,
      header: "تأكيد الحذف",
      icon: "pi pi-exclamation-triangle",
      acceptLabel: "حذف",
      rejectLabel: "إلغاء",
      acceptButtonStyleClass: "p-button-danger",
      accept: () => {
        // Simulate API call
        this.documentService.deleteDocument(doc?.id!).subscribe({
        next:(res)=>{
          console.log(res);
           this.messageService.add({
                severity: 'success',
                summary: 'تم الحذف',
                detail: res.message,
              });
          this.loadDocuments() // Refresh documents after deletion
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
    })
  }

  onDocumentPageChange(event: any): void {
    this.firstDocument = event.first
    this.documentsPerPage = event.rows
    // Load documents for the new page
    this.loadDocuments()
  }

  onPageChange(event: any): void {
    this.first = event.first
    this.rows = event.rows
  }

  refreshActivity(): void {
    this.loadActivities()
    this.messageService.add({
      severity: "info",
      summary: "تم التحديث",
      detail: "تم تحديث سجل النشاطات",
    })
  }

  fetchFolders(): void {
    // Method for refreshing folder data
    this.loadFolderDetails()
    this.loadSubFolders()
    this.loadDocuments()
  }
  uploadedDocument(event:any): void {
      this.visable = event;
        this.loadDocuments()

    }
}
