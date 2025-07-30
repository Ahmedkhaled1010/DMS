import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router"
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators } from "@angular/forms"
import { CardModule } from 'primeng/card';

// PrimeNG Imports
import { TableModule } from "primeng/table"
import { ButtonModule } from "primeng/button"
import { DialogModule } from "primeng/dialog"
import { InputTextModule } from "primeng/inputtext"
import { InputTextareaModule } from "primeng/inputtextarea"
import { DropdownModule } from "primeng/dropdown"
import { ProgressSpinnerModule } from "primeng/progressspinner"
import { ToastModule } from "primeng/toast"
import { ConfirmDialogModule } from "primeng/confirmdialog"
import { MessageService, ConfirmationService } from "primeng/api"
import { PaginatorModule } from "primeng/paginator"

import { Folder } from "../../Interfaces/Folder/folder"
import { DocumentService } from "../../Services/Document/document.service"
import { FolderService } from "../../Services/Folder/folder.service"
import { WorkspaceService } from "../../Services/Workspace/workspace.service"
import { WorkspaceData } from "../../Interfaces/Workspace/workspace"

interface ParentOption {
  id: string
  name: string
  type: "workspace" | "folder"
}
@Component({
  selector: 'app-foldermanager',
  standalone: true,
 imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    InputTextareaModule,
    DropdownModule,
    ProgressSpinnerModule,
    ToastModule,
    ConfirmDialogModule,
    PaginatorModule,
    CardModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './foldermanager.component.html',
  styleUrl: './foldermanager.component.scss'
})
export class FoldermanagerComponent {
  folders: Folder[] = []
  loading = true
  error: string | null = null
  workspaces:WorkspaceData[] = []
  // Pagination properties
  totalRecords = 0
  rows = 10 // Items per page
  first = 0 // Index of the first item on the current page

  // Dialog properties
  showFolderDialog = false
  folderForm: FormGroup
  isEditMode = false
  selectedFolder: Folder | null = null

  parentOptions: ParentOption[] = []

  constructor(
    private documentService: DocumentService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private folderService: FolderService,
    private  _WorkspaceService:WorkspaceService
  ) {
    // Initialize FormGroup directly
    this.folderForm = new FormGroup({
      name: new FormControl("", Validators.required),
      description: new FormControl(""),
      parentId: new FormControl(null, Validators.required),
    })
  }

  ngOnInit(): void {
    this.fetchFolders()
    //this.loadParentOptions()
  }

  async fetchFolders(): Promise<void> {
    this.loading = true
    this.error = null
    try {
     this.folderService.getAllFolderUser().subscribe(
        {
          next: (response) => {
            this.folders = response.data
            this.totalRecords = response.data.length
          },
          error: (err) => {
            console.error(err)
            this.error = "فشل تحميل المجلدات."
            this.messageService.add({
              severity: "error",
              summary: "خطأ",
              detail: this.error,
            })
          },
        }
      )
     // this.folders = allFolders
      this.totalRecords =  this.folders.length
      this.loading = false
    } catch (err) {
      this.error = "فشل تحميل المجلدات."
      this.messageService.add({
        severity: "error",
        summary: "خطأ",
        detail: this.error,
      })
      this.loading = false
    }
  }

 /* async loadParentOptions(): Promise<void> {
    try {
         this._WorkspaceService.getWorkspaces().subscribe({
          next:(res)=>{
             this.workspaces =res.data;
          }
         })
   this.folderService.getAllFolders().subscribe({
    next:(res)=>{
      console.log(res);
       const folders = res.data;
    },error:(err)=>{
      console.log(err);
      
    }
   })

     /* const workspaceOptions: ParentOption[] = workspaces.map((ws) => ({
        id: ws.id,
        name: `مساحة عمل: ${ws.name}`,
        type: "workspace",
      }))

      const folderOptions: ParentOption[] = folders.map((f) => ({
        id: f.id,
        name: `مجلد: ${f.name}`,
        type: "folder",
      }))

      this.parentOptions = [...workspaceOptions, ...folderOptions]*/
    /*} catch (err) {
      console.error("Failed to load parent options:", err)
      this.messageService.add({
        severity: "error",
        summary: "خطأ",
        detail: "فشل تحميل خيارات الوالد.",
      })
    }
  }

  onPageChange(event: any): void {
    this.first = event.first
    this.rows = event.rows
    // Re-fetch data if using server-side pagination, otherwise just update view
  }*/
 onPageChange(event: any): void {
    this.first = event.first
    this.rows = event.rows
    // Re-fetch data if using server-side pagination, otherwise just update view
  }
  openNewFolderDialog(): void {
    this.isEditMode = false
    this.selectedFolder = null
    this.folderForm.reset()
    this.showFolderDialog = true
  }

  editFolder(folder: Folder): void {
    this.isEditMode = true
    this.selectedFolder = { ...folder } // Create a copy
    this.folderForm.patchValue({
      name: folder.name,
      description: folder.description,
      parentId: folder.parentId,
    })
    this.showFolderDialog = true
  }

  async saveFolder(): Promise<void> {
    if (this.folderForm.invalid) {
      this.folderForm.markAllAsTouched()
      this.messageService.add({
        severity: "error",
        summary: "خطأ",
        detail: "يرجى ملء جميع الحقول المطلوبة.",
      })
      return
    }

    const formData = this.folderForm.value
    const parent = this.parentOptions.find((opt) => opt.id === formData.parentId)

    if (!parent) {
      this.messageService.add({
        severity: "error",
        summary: "خطأ",
        detail: "يرجى اختيار والد صالح.",
      })
      return
    }

    const folderData: Omit<Folder, "id" | "createdAt" | "updatedAt"> = {
      name: formData.name,
      description: formData.description,
      parentId: parent.id,
    }

    try {
      if (this.isEditMode && this.selectedFolder) {
        //await this.documentService.updateFolder({ ...this.selectedFolder, ...folderData })
      } else {
        //await this.documentService.addFolder(folderData)
      }
      this.showFolderDialog = false
      this.fetchFolders() // Refresh the list
      this.messageService.add({
        severity: "success",
        summary: "نجاح",
        detail: `تم ${this.isEditMode ? "تحديث" : "إضافة"} المجلد بنجاح.`,
      })
    } catch (err) {
      this.messageService.add({
        severity: "error",
        summary: "خطأ",
        detail: `فشل ${this.isEditMode ? "تحديث" : "إضافة"} المجلد.`,
      })
    }
  }

  confirmDeleteFolder(event: Event, folder: Folder): void {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: `هل أنت متأكد أنك تريد حذف المجلد "${folder.name}"؟ هذا الإجراء لا يمكن التراجع عنه.`,
      icon: "pi pi-exclamation-triangle",
      acceptLabel: "نعم، احذف",
      rejectLabel: "إلغاء",
      acceptButtonStyleClass: "p-button-danger p-button-sm",
      rejectButtonStyleClass: "p-button-text p-button-sm",
      accept: () => {
        this.deleteFolder(folder.id)
      },
      reject: () => {
        this.messageService.add({
          severity: "info",
          summary: "تم الإلغاء",
          detail: "تم إلغاء عملية الحذف.",
        })
      },
    })
  }

  async deleteFolder(id: string): Promise<void> {
    try {
     // await this.documentService.deleteFolder(id)
      this.fetchFolders() // Refresh the list
    } catch (err) {
      this.messageService.add({
        severity: "error",
        summary: "خطأ",
        detail: "فشل حذف المجلد.",
      })
    }
  }

  getParentName(parentId: string | null, parentType: "workspace" | "folder" | null): string {
    if (!parentId || !parentType) return "لا يوجد"
    const parent = this.parentOptions.find((opt) => opt.id === parentId && opt.type === parentType)
    return parent ? parent.name : "غير معروف"
  }
}
