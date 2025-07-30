import { Component, EventEmitter, Input, Output, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { Form, FormsModule } from "@angular/forms" // Required for ngModel

// PrimeNG Imports
import { DialogModule } from "primeng/dialog"
import { FileUploadModule } from "primeng/fileupload"
import { DropdownModule } from "primeng/dropdown"
import { ButtonModule } from "primeng/button"
import { ToastModule } from "primeng/toast" // For success/error messages
import { MessageService } from "primeng/api" // For Toast messages
import { WorkspaceService } from "../../Services/Workspace/workspace.service"
import { FolderService } from "../../Services/Folder/folder.service"
import { DocumentService } from "../../Services/Document/document.service"

interface Folder {
  name: string
  id: string
}

interface Workspace {
  name: string
  id: string
}

@Component({
  selector: 'app-fileupload',
  standalone: true,
    imports: [CommonModule, FormsModule, DialogModule, FileUploadModule, DropdownModule, ButtonModule, ToastModule],
  providers: [MessageService],
  templateUrl: './fileupload.component.html',
  styleUrl: './fileupload.component.scss'
})
export class FileuploadComponent {
   @Input() visible = false
  @Output() visibleChange = new EventEmitter<boolean>()
  @Output() fileUploaded = new EventEmitter<{
    files: File[]
    folder: Folder | null
    workspace: Workspace | null
  }>()

  formData:FormData = new FormData();
  folders: Folder[] = []
  workspaces: Workspace[] = []

  selectedFolder: Folder | null = null
  selectedWorkspace: Workspace | null = null
  uploadedFiles: File[] = []      


  constructor(private messageService: MessageService,
    private _WorkspaceService:WorkspaceService,
    private _FolderService:FolderService,
    private _DocumentService:DocumentService

  ) {}

  ngOnInit(): void {
    // Mock data for folders and workspaces
   this.getFolders();
    this.getWorkspaces();
  }
  
  onModalHide(): void {
    this.visibleChange.emit(false)
    this.resetForm()
  }
  getFolders(): void {
    this._FolderService.getAllFolders().subscribe({
      next: (res) => {
        this.folders=res.data;
      },
      error:(err)=>{
        
      }
     })
  }
  getWorkspaces(): void {
    this._WorkspaceService.getWorkspaces().subscribe({
      next: (res) => {
        this.workspaces = res.data;
      },
      error: (err) => {
        console.error('Error fetching workspaces:', err);
      }
    });
  }
  onFileSelect(event: any): void {
    if (event.files && event.files.length > 0) {
      
      this.uploadedFiles = [...this.uploadedFiles, ...event.files] ;
        for (let file of event.files) {
      this.formData.append('files', file);
    }
      /*this.uploadedFile = event.files[0]
        this.messageService.add({
          severity: "info",
          summary: "File Selected",
          detail: this.uploadedFile?.name,
        })*/
      }
    }

    onUploadClick(): void {
    if (this.uploadedFiles.length === 0) {

      // التحقق من وجود ملفات في المصفوفة
      this.messageService.add({
        severity: "error",
        summary: "Error",
        detail: "Please select at least one file to upload.",
      })
      return
    }
    console.log("Selected Folder:", this.selectedFolder);
    console.log("Selected Workspace:", this.selectedWorkspace);
    
    

    if (!this.selectedFolder && !this.selectedWorkspace) {
      this.messageService.add({
        severity: "error",
        summary: "Error",
        detail: "Please select a folder or workspace.",
      })
      return
    }
    console.log("Form Data:", this.formData);
    
if (this.selectedFolder&&this.selectedWorkspace) {
  this._DocumentService.createDocumentInWorkspaceAndFolder(this.selectedWorkspace.id, this.selectedFolder.id, this.formData)
    .subscribe({
      next:(res)=>{
        console.log(res);
          this.resetForm()
        
      },
      error:(err)=>{
        console.log(err );
        
      }
    })
  
}
else if (this.selectedFolder) {
  this._DocumentService.createDocumentInFolder(this.selectedFolder.id, this.formData)
    .subscribe({
      next:(res)=>{
        console.log(res);
            this.resetForm()

      },
      error:(err)=>{
        console.log(err );
        
      }
    })
  
}
else if (this.selectedWorkspace) {
  this._DocumentService.createDocumentInWorkspace(this.selectedWorkspace.id, this.formData)
    .subscribe({
      next:(res)=>{
        console.log(res);
            this.resetForm()

      },
      error:(err)=>{
        console.log(err );
        
      }
    })}
    

    // Simulate file upload for each file
   /* this.uploadedFiles.forEach((file) => {
      console.log("Uploading file:", file.name)
    })
    console.log("To Folder:", this.selectedFolder.name)
    console.log("To Workspace:", this.selectedWorkspace.name)

    // Emit the uploaded files and selected options
    this.fileUploaded.emit({
      files: this.uploadedFiles, // إرسال مصفوفة الملفات
      folder: this.selectedFolder,
      workspace: this.selectedWorkspace,
    })
*/
    this.messageService.add({
      severity: "success",
      summary: "Success",
      detail: `${this.uploadedFiles.length} file(s) uploaded successfully!`,
    })

    this.visible = false
    this.visibleChange.emit(false)
    this.resetForm()
  }

  resetForm(): void {
    this.uploadedFiles = [] // إعادة تعيين المصفوفة
    this.selectedFolder = null
    this.selectedWorkspace = null
    // Clear file upload component if possible (might require a viewChild)
    // For now, just reset the internal state
  }
}
