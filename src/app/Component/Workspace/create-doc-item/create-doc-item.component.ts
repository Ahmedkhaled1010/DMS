import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
  input,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';
import { Subject, takeUntil } from 'rxjs';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastrService } from 'ngx-toastr';
import { FolderService } from '../../../Services/Folder/folder.service';
import {
  CreateDocumentData,
  CreateFolderData,
  Folder,
} from '../../../Interfaces/Folder/folder';
import { TranslateModule } from '@ngx-translate/core';
import { DocumentService } from '../../../Services/Document/document.service';

interface UploadEvent {
  originalEvent: Event;
  files: File[];
}
@Component({
  selector: 'app-create-doc-item',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    FileUploadModule,
  ],
  templateUrl: './create-doc-item.component.html',
  styleUrl: './create-doc-item.component.scss',
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-in', style({ opacity: 1 })),
      ]),
      transition(':leave', [animate('300ms ease-out', style({ opacity: 0 }))]),
    ]),
    trigger('slideInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.95) translateY(20px)' }),
        animate(
          '400ms cubic-bezier(0.34, 1.56, 0.64, 1)',
          style({ opacity: 1, transform: 'scale(1) translateY(0)' })
        ),
      ]),
      transition(':leave', [
        animate(
          '300ms ease-out',
          style({ opacity: 0, transform: 'scale(0.95) translateY(20px)' })
        ),
      ]),
    ]),
    trigger('slideDown', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate(
          '200ms ease-in',
          style({ opacity: 1, transform: 'translateY(0)' })
        ),
      ]),
    ]),
  ],
})
export class CreateDocItemComponent {
  @Input() isOpen: boolean = false;
  @Input() itemType: 'folder' | 'document' = 'folder';
  @Output() closeEvent = new EventEmitter<void>();
  workspaceId = input<string>();
  folderId: string = '';
  availableFolders: Folder[] = [];
  isLoading = false;
  isUpdated = input<boolean>(false);
  uploadedFiles: File[] = [];

  private destroy$ = new Subject<void>();

  /*createForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(2)]),
    parentId: new FormControl(''),
    folderId: new FormControl(''),
    fileType: new FormControl('txt'),
    content: new FormControl('')
  });*/
  createForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(2)]),
    description: new FormControl('', [Validators.required]),
  });
  updateForm: FormGroup = new FormGroup({
    name: new FormControl(''),
    description: new FormControl(''),
  });

  constructor(
    private fileSystemService: FolderService,
    private toastr: ToastrService,
    private _DocumentService: DocumentService
  ) {}

  ngOnInit(): void {
    console.log(this.folderId);

    this.fileSystemService.folderId.subscribe((res) => {
      this.folderId = this.fileSystemService.folderId.getValue();
      console.log(res);
    });
    this.loadAvailableFolders();
    console.log(this.folderId);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  onUpload(event: any) {
    const formData = new FormData();
    for (let file of event.files) {
      formData.append('files', file);
    }
    console.log(this.uploadedFiles);

    // formData.append('workSpaceId', '456');
    if (this.folderId == '' || this.folderId == undefined) {
      this._DocumentService
        .createDocumentInWorkspace(this.workspaceId(), formData)
        .subscribe({
          next: (res) => {
            console.log(res);
            this._DocumentService.documentCreated.next(true);
          },
          error: (err) => {
            console.log(err);
          },
          complete: () => {
            this.closeModal();
            this.fileSystemService.folderCreated.next(true);
          },
        });
    } else {
      this._DocumentService
        .createDocumentInFolder(this.folderId, formData)
        .subscribe({
          next: (res) => {
            console.log(res);
            this._DocumentService.documentCreated.next(true);
          },
          error: (err) => {
            console.log(err);
          },
          complete: () => {
            this.closeModal();
            this.fileSystemService.folderCreated.next(true);
          },
        });
    }

    //  this.messageService.add({severity: 'info', summary: 'File Uploaded', detail: ''});
  }
  onSelect(event: any) {
    this.uploadedFiles.push(event.currentFiles);
    console.log('Selected files:', this.uploadedFiles);
  }
  loadAvailableFolders(): void {
    this.fileSystemService.folders$
      .pipe(takeUntil(this.destroy$))
      .subscribe((folders) => {
        this.availableFolders = folders;
      });
  }

  hasError(fieldName: string): boolean {
    const field = this.createForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getErrorMessage(fieldName: string): string {
    const field = this.createForm.get(fieldName);

    if (field?.errors) {
      if (field.errors['required']) {
        return 'هذا الحقل مطلوب';
      }
      if (field.errors['minlength']) {
        const requiredLength = field.errors['minlength'].requiredLength;
        return `يجب أن يكون الاسم ${requiredLength} أحرف على الأقل`;
      }
    }
    return '';
  }

  onSubmit(): void {
    if (this.createForm.invalid) {
      this.createForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    if (this.itemType === 'folder') {
      this.createFolder();
    } else {
      this.createDocument();
    }
  }

  private createFolder(): void {
    const folderData: CreateFolderData = {
      name: this.createForm.value.name,
      description: this.createForm.value.description || undefined,
    };
    console.log(this.folderId);

    if (this.folderId == '' || this.folderId == undefined) {
      this.fileSystemService
        .createWorkspaceFolder(folderData, this.workspaceId()!)
        .subscribe({
          next: (res) => {
            console.log(res);
            this.toastr.success(res.message);
            this.closeModal();
            this.fileSystemService.folderCreated.next(true);
          },
          error: (err) => {
            console.log(err);
          },
          complete: () => {
            this.isLoading = false;
          },
        });
      console.log('workspace');
    } else {
      this.fileSystemService
        .createChildFolder(folderData, this.folderId)
        .subscribe({
          next: (res) => {
            console.log(res);
            this.toastr.success(res.message);
            this.closeModal();
            this.fileSystemService.folderCreated.next(true);
          },
          error: (err) => {
            console.log(err);
          },
          complete: () => {
            this.isLoading = false;
          },
        });
      console.log('folder');
    }
  }

  private createDocument(): void {
    const documentData: CreateDocumentData = {
      name: this.createForm.value.name,
      content: this.createForm.value.content,
      folderId: this.createForm.value.folderId || undefined,
      fileType: this.createForm.value.fileType,
    };

    
  }
  onUpdate() {
    this.fileSystemService
      .updateFolder(this.folderId, this.updateForm.value)
      .subscribe({
        next: (res) => {
          console.log(res);
          this.toastr.success(res.message);
          this.closeModal();
          this.fileSystemService.folderCreated.next(true);
          this.isUpdated;
        },
        error: (err) => {
          console.log(err);
        },
        complete: () => {
          this.isLoading = false;
        },
      });
  }
  closeModal(): void {
    this.fileSystemService.isCreateModalOpen.next(false);
    this.closeEvent.emit();
    this.resetForm();
  }

  private resetForm(): void {
    this.createForm.reset({
      fileType: 'txt',
    });
    this.isLoading = false;
  }
}
