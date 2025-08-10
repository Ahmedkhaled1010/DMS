import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router"
import { FormsModule, ReactiveFormsModule, FormGroup,FormBuilder, FormControl, Validators } from "@angular/forms"
import { CardModule } from 'primeng/card';
import { ChangeDetectorRef } from '@angular/core';

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

import { Folder, FolderCriteria, FolderData } from "../../Interfaces/Folder/folder"
import { DocumentService } from "../../Services/Document/document.service"
import { FolderService } from "../../Services/Folder/folder.service"
import { WorkspaceService } from "../../Services/Workspace/workspace.service"
import { WorkspaceData } from "../../Interfaces/Workspace/workspace"
import { TranslateModule } from "@ngx-translate/core";
import e from "express";

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
    CardModule,
    TranslateModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './foldermanager.component.html',
  styleUrl: './foldermanager.component.scss'
})

export class FoldermanagerComponent {
   folders: Folder[] = []
  workspaces: WorkspaceData[] = []
  folderData:FolderData[] = []
  parentId: string =""
  workspaceId: string =""
  loading = false
  error: string | null = null
  showFolderDialog = false
  isEditMode = false
  parentOptions: any[] = []
  first = 0
  rows = 10
  pageSize = 10;
  currentPage = 1;
  sortField = 'createdAt';
  sortOrder = -1;
  totalRecords = 0
  searchTerm = ""
  folderId:string=""
  folderForm: FormGroup =new FormGroup({

    name: new FormControl(""),
    description: new FormControl(""),
    workspaceId: new FormControl(""),
    parentId: new FormControl(""),
  })

  constructor(private fb: FormBuilder,
    private folderService: FolderService,
    private WorkspaceService:WorkspaceService,
        private confirmationService: ConfirmationService,
        private messageService: MessageService,
        private cdRef: ChangeDetectorRef

  ) {
    
  }

  ngOnInit() {
    // Your existing initialization code
    this.loadFolders()
    this.getFolderData()
    this.getWorkspaces()
  }
  getFolderData() {
    this.folderService.getAllFolders().subscribe({
      next: (res) => {
        this.folderData = res.data;
      },
      error: (err) => {
        console.log(err);
        
      }});
  }
  getWorkspaces() {

    this.WorkspaceService.getWorkspaces().subscribe({
        next: (res) => {
        this.workspaces = res.data;
        console.log("Workspaces:", this.workspaces);
        
        
      },
      error: (err) => {
        console.error("Error fetching workspaces:", err);
      }

    })
  }
  // Keep all your existing methods exactly as they are
  openNewFolderDialog() {
    this.isEditMode = false
    this.showFolderDialog = true
    this.folderForm.reset()
  }

  editFolder(folder: any) {
    this.isEditMode = true
    this.showFolderDialog = true
    this.folderId=folder.id;
    this.folderForm.patchValue({
      name: folder.name,
      description: folder.description
    })
    console.log(this.folderForm.value);
    
  }

  saveFolder() {
    if (this.folderForm.valid) {
      // Your existing save logic
      if (this.isEditMode) {
        const updatedFolder = {
          name: this.folderForm.value.name,
          description: this.folderForm.value.description,
        }
        this.folderService.updateFolder(this.folderId,updatedFolder).subscribe({
          next:(res)=>{
            console.log(res);
            this.loadFolders()
          },
          error:(err)=>{
            console.log(err);
            
          }
        })
      }
      else {
        if (!this.folderForm.value.name || !this.folderForm.value.description) {
          this.messageService.add({
      severity: 'error',
      summary: 'Error in Data', 
      detail: 'Please fill in all required fields name and description.',
    });
        
          return;
        }
         const updatedFolder = {
          name: this.folderForm.value.name,
          description: this.folderForm.value.description,
        }
        if (this.folderForm.value.workspaceId&&this.folderForm.value.parentId) {
          this.folderService.createFolder(updatedFolder,this.folderForm.value.parentId,this.folderForm.value.workspaceId).subscribe({
            next:(res)=>{
              console.log(res);
              this.loadFolders()
            },
            error:(err)=>{
              console.log(err);
              
            }   })
        }
        else if (this.folderForm.value.workspaceId) {
          this.folderService.createWorkspaceFolder(updatedFolder,this.folderForm.value.workspaceId).subscribe({
            next:(res)=>{
              console.log(res);
              this.loadFolders()
            },
            error:(err)=>{
              console.log(err);
              
            }
          })
        }
        else if (this.folderForm.value.parentId) {
          this.folderService.createFolderInParent(updatedFolder,this.folderForm.value.parentId).subscribe({
            next:(res)=>{
              console.log(res);
              this.loadFolders()
            },
            error:(err)=>{
              console.log(err);
              
            }
          })
        }

      
        
        
      }
      console.log("Saving folder:", this.folderForm.value)
      this.showFolderDialog = false
    }
  }

  confirmDeleteFolder(event: Event, folder: Folder) {
    // Your existing delete confirmation logic
     event.stopPropagation();

    this.confirmationService.confirm({
      message: `هل أنت متأكد من حذف الملف "${folder.name}"؟`,
      header: 'تأكيد الحذف',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'نعم',
      rejectLabel: 'لا',
      accept: () => {
       this.folderService.deleteFolder(folder.id).subscribe({
        next:(res)=>{
          console.log(res);
          this.loadFolders()
        },
        error:(err)=>{
          console.log(err);
          
        }
       })
       
      }
    });
    console.log("Deleting folder:", folder)
  }

  onPageChange(event: any) {
      this.currentPage = Math.floor((event.first || 0) / (event.rows || 10)) + 1;
    this.pageSize = event.rows || 10;
    this.sortField = event.sortField as string || 'createdAt';
    this.sortOrder = event.sortOrder || -1;
   // this.first = event.first
   // this.pageSize = event.rows
    // Your existing pagination logic
    console.log("Page changed:", event);
    this.loadFolders();
    
  }

  getParentName(parentId: string, parentType: string): string {
    // Your existing parent name logic
    const parent = this.parentOptions.find((p) => p.id === parentId)
    return parent ? parent.name : "غير معروف"
  }
onLazyLoad(event: any): void {
    this.currentPage = Math.floor((event.first || 0) / (event.rows || 10)) + 1;
    this.pageSize = event.rows || 10;
    this.sortField = event.sortField as string || 'createdAt';
    this.sortOrder = event.sortOrder || -1;
    
  // this.loadFolders();
  }
  loadFolders() {
    this.loading = true
    this.error = null
    const folderCriteria: FolderCriteria = {
      name: this.searchTerm,
      workspaceId: this.workspaceId,
       pageNum:this.currentPage!==null?this.currentPage:1,
      pageSize:this.pageSize!==null ?this.pageSize:10,
      sortDirection:this.sortOrder===1?'asc' : 'desc',
      sortField:this.sortField!==null?this.sortField:"fileName"}

    this.folderService.getAllFolderUser(folderCriteria).subscribe({

      next:(res)=>{
         
      this.folders = res.data;
      this.totalRecords = res.totalElements;
      this.loading = false;
    this.cdRef.detectChanges(); // ✅ حل رسمي

       
        

      },error:(err)=>{
        console.log(err);
        
      }
    })
    // Your existing load folders logic
    
      
   
  }
onWorkspaceChange(event: any) {
    this.workspaceId = event.value.id}
  retryLoad() {
    this.error = null
    this.loadFolders()
  }

  refreshData() {
    this.loadFolders()
  }
}
