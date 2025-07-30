import { WorkspaceData } from './../../Interfaces/Workspace/workspace';
import { Component, EventEmitter, Input, Output, type OnInit, type OnChanges, type SimpleChanges } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormGroup, ReactiveFormsModule, type FormBuilder, Validators, FormControl } from "@angular/forms"
 import { RadioButtonModule } from 'primeng/radiobutton';

// PrimeNG Imports
import { DialogModule } from "primeng/dialog"
import { InputTextModule } from "primeng/inputtext"
import { DropdownModule } from "primeng/dropdown"
import { ButtonModule} from "primeng/button"
import { CheckboxModule } from "primeng/checkbox"
import { ToastModule } from "primeng/toast"
import { MessageService } from "primeng/api"
import { FolderService } from "../../Services/Folder/folder.service"
import { WorkspaceService } from "../../Services/Workspace/workspace.service"
import { TranslateModule } from '@ngx-translate/core';
import { DocumentService } from '../../Services/Document/document.service';
interface Document {
  id: string
  title: string
  fileName: string
  // تم إزالة fileType و filePath
  isShared: boolean
  isArchived: boolean
  isDeleted: boolean
  tag: string
  privacy: string
  workspaceName: string
  folderId: string
}

interface FolderOption {
  id: string
  name: string
}

interface WorkspaceOption {
  id: string
  name: string
}
@Component({
  selector: 'app-update-document',
  standalone: true,
 imports: [
    CommonModule,
    ReactiveFormsModule,
    DialogModule,
    InputTextModule,
    DropdownModule,
    ButtonModule,
    CheckboxModule,
    ToastModule,
    TranslateModule,
    RadioButtonModule
  ],
  providers: [MessageService],
  templateUrl: './update-document.component.html',
  styleUrl: './update-document.component.scss'
})
export class UpdateDocumentComponent {
  @Input() showEditModal = false
  @Input() documentData:any = null // بيانات المستند الحالية
  @Output() showEditModalChange = new EventEmitter<boolean>()
  @Output() documentUpdated = new EventEmitter<Document>()

  editForm: FormGroup=new FormGroup({
     
  
      fileName: new FormControl(null),
      isShared: new FormControl(null),
      isArchived: new FormControl(null),
      isDeleted: new FormControl(null),
      tag: new FormControl(null),
      privacy: new FormControl(null),
      workspaceName: new FormControl(null), 
      folderId: new FormControl(null),

  })
  updating = false

  tagOptions: string[] = ["GENERAL", "IMPORTANT", "URGENT", "REVIEW", "DRAFT"]
  privacyOptions: string[] = ["PRIVATE", "PUBLIC"]
  // تم إزالة fileTypeOptions
  folderOptions: FolderOption[] = [
   
  ]
  workspaceOptions: WorkspaceOption[] = [
   
  ]

  constructor(
    private messageService: MessageService,
    private _FolderService:FolderService,
    private _WorkspaceService:WorkspaceService,
    private _DocumentService: DocumentService,
  ) {}

  ngOnInit(): void {
    this._FolderService.folderData.subscribe((res)=>{

      this.folderOptions=res;
    })
    this._WorkspaceService.Workspaces.subscribe((res)=>{
      this.workspaceOptions=res;
    })
   /* this.editForm
    this.editForm:FormGroup = this.fb.group({
      id: [""], // لإرسال الـ ID مع التحديث
      title: ["", Validators.required],
      fileName: ["", Validators.required],
      // تم إزالة fileType و filePath
      isShared: [false],
      isArchived: [false],
      isDeleted: [false],
      tag: ["GENERAL", Validators.required],
      privacy: ["PRIVATE", Validators.required],
      workspaceName: ["", Validators.required], // تم تغيير هذا ليتوافق مع طلبك
      folderId: ["", Validators.required],
    })*/
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["documentData"] && this.documentData) {
      this.editForm.patchValue(this.documentData)
    }
    if (changes["showEditModal"] && !this.showEditModal) {
      // Reset form when modal closes
      this.editForm.reset()
    }
  }

  getFolder()
  {

  }
  updateDocument(): void {
    if (this.editForm.invalid) {
      this.messageService.add({
        severity: "error",
        summary: "Validation Error",
        detail: "Please fill all required fields.",
      })
      this.editForm.markAllAsTouched() // لإظهار أخطاء التحقق
      return
    }

    console.log(this.editForm.value);
    
    this.updating = true
    const updatedDoc: Document = this.editForm.getRawValue() 
    console.log(this.documentData);
    console.log(this.documentData?.id );
    
    this._DocumentService.updateDocument(this.documentData?.id || '', this.editForm.value).subscribe(
      {
        next:(res) => {
          console.log(res);
          
        },
        error:(err)=>{
          console.log(err);
          
        }
      });
    // Simulate API call
    setTimeout(() => {
      console.log("Updating document:", updatedDoc)
      this.documentUpdated.emit(updatedDoc)
      this.messageService.add({
        severity: "success",
        summary: "Success",
        detail: "Document updated successfully!",
      })
      this.closeEditDialog()
      this.updating = false
    }, 1000)
  }

  closeEditDialog(): void {
    console.log(12);
    
    this.showEditModal = false
    this.showEditModalChange.emit(false)
    console.log(this.showEditModalChange);
    
    this.editForm.reset() // إعادة تعيين النموذج عند الإغلاق
  }

}
