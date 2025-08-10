import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  type OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Form, FormsModule } from '@angular/forms'; // Required for ngModel

// PrimeNG Imports
import { DialogModule } from 'primeng/dialog';
import { FileUpload, FileUploadModule } from 'primeng/fileupload';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast'; // For success/error messages
import { MessageService } from 'primeng/api'; // For Toast messages
import { WorkspaceService } from '../../Services/Workspace/workspace.service';
import { FolderService } from '../../Services/Folder/folder.service';
import { DocumentService } from '../../Services/Document/document.service';

interface Folder {
  name: string;
  id: string;
}

interface Workspace {
  name: string;
  id: string;
}

@Component({
  selector: 'app-fileupload',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DialogModule,
    FileUploadModule,
    DropdownModule,
    ButtonModule,
    ToastModule,
  ],
  providers: [MessageService],
  templateUrl: './fileupload.component.html',
  styleUrl: './fileupload.component.scss',
})
export class FileuploadComponent {
 /*@Input() visible = false;
  @Input() folderId = '';
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() fileUploaded = new EventEmitter<{
    files: File[];
    folder: Folder | null;
    workspace: Workspace | null;
  }>();
isUploading:boolean = false;
  formData: FormData = new FormData();
  folders: Folder[] = [];
  workspaces: Workspace[] = [];

  selectedFolder: Folder | null = null;
  selectedWorkspace: Workspace | null = null;
  uploadedFiles: File[] = [];

  constructor(
    private messageService: MessageService,
    private _WorkspaceService: WorkspaceService,
    private _FolderService: FolderService,
    private _DocumentService: DocumentService
  ) {}

  ngOnInit(): void {
    // Mock data for folders and workspaces
    this.getFolders();
    this.getWorkspaces();
  }

  onModalHide(): void {
    this.visibleChange.emit(false);
    this.resetForm();
  }
  getFolders(): void {
    this._FolderService.getAllFolders().subscribe({
      next: (res) => {
        this.folders = res.data;
      },
      error: (err) => {},
    });
  }
  getWorkspaces(): void {
    this._WorkspaceService.getWorkspaces().subscribe({
      next: (res) => {
        this.workspaces = res.data;
      },
      error: (err) => {
        console.error('Error fetching workspaces:', err);
      },
    });
  }
  onFileSelect(event: any): void {
    if (event.files && event.files.length > 0) {
      this.uploadedFiles = [...this.uploadedFiles, ...event.files];
      for (let file of event.files) {
        this.formData.append('files', file);
      }
      /*this.uploadedFile = event.files[0]
        this.messageService.add({
          severity: "info",
          summary: "File Selected",
          detail: this.uploadedFile?.name,
        })*/
   /* }
  }

 /* onUploadClick(): void {
    if (this.uploadedFiles.length === 0) {
      // التحقق من وجود ملفات في المصفوفة
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please select at least one file to upload.',
      });
      return;
    }
    console.log('Selected Folder:', this.selectedFolder);
    console.log('Selected Workspace:', this.selectedWorkspace);

    if (this.folderId != '') {
      
     this._DocumentService
          .createDocumentInFolder(this.folderId, this.formData)
          .subscribe({
            next: (res) => {
              console.log(res);
              this.resetForm();
            },
            error: (err) => {
              console.log(err);
            },});
    } else {
      if (!this.selectedFolder && !this.selectedWorkspace) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Please select a folder or workspace.',
        });
        return;
      }
      console.log('Form Data:', this.formData);

      if (this.selectedFolder && this.selectedWorkspace) {
        this._DocumentService
          .createDocumentInWorkspaceAndFolder(
            this.selectedWorkspace.id,
            this.selectedFolder.id,
            this.formData
          )
          .subscribe({
            next: (res) => {
              console.log(res);
              this.resetForm();
            },
            error: (err) => {
              console.log(err);
            },
          });
      } else if (this.selectedFolder) {
        this._DocumentService
          .createDocumentInFolder(this.selectedFolder.id, this.formData)
          .subscribe({
            next: (res) => {
              console.log(res);
              this.resetForm();
            },
            error: (err) => {
              console.log(err);
            },
          });
      } else if (this.selectedWorkspace) {
        this._DocumentService
          .createDocumentInWorkspace(this.selectedWorkspace.id, this.formData)
          .subscribe({
            next: (res) => {
              console.log(res);
              this.resetForm();
            },
            error: (err) => {
              console.log(err);
            },
          });
      }
    }

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
    /*this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: `${this.uploadedFiles.length} file(s) uploaded successfully!`,
    });

    this.visible = false;
    this.visibleChange.emit(false);
    this.resetForm();
  }

  resetForm(): void {
    this.uploadedFiles = []; // إعادة تعيين المصفوفة
    this.selectedFolder = null;
    this.selectedWorkspace = null;
    // Clear file upload component if possible (might require a viewChild)
    // For now, just reset the internal state
  }*/
    @Input() visible = false;
  @Input() folderId = '';
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() fileUploaded = new EventEmitter<{
    files: File[];
    folder: Folder | null;
    workspace: Workspace | null;
  }>();

  @ViewChild('fileUpload') fileUpload!: FileUpload;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('audioPlayer') audioPlayer!: ElementRef<HTMLAudioElement>;

  // Existing properties
  isUploading = false;
  formData: FormData = new FormData();
  folders: Folder[] = [];
  workspaces: Workspace[] = [];
  selectedFolder: Folder | null = null;
  selectedWorkspace: Workspace | null = null;
  uploadedFiles: File[] = [];

  // Media capture properties
  showMediaCapture = false;
  mediaType: 'photo' | 'video' | 'audio' | null = null;
  cameraActive = false;
  isRecording = false;
  isProcessing = false;
  
  // Camera/Video properties
  mediaStream: MediaStream | null = null;
  mediaRecorder: MediaRecorder | null = null;
  recordedChunks: Blob[] = [];
  capturedPhoto: string | null = null;
  
  // Audio properties
  audioBlob: Blob | null = null;
  audioUrl: string | null = null;
  audioWaves: number[] = [];
  
  // Recording timer
  recordingTime = '00:00';
  recordingInterval: any;
  recordingStartTime = 0;

  constructor(
    private messageService: MessageService,
    private _WorkspaceService: WorkspaceService,
    private _FolderService: FolderService,
    private _DocumentService: DocumentService
  ) {}

  ngOnInit(): void {
    this.getFolders();
    this.getWorkspaces();
    this.initializeAudioWaves();
  }

  ngOnDestroy(): void {
    this.cleanup();
  }

  // Existing methods
  onModalHide(): void {
    this.visibleChange.emit(false);
    this.resetForm();
    this.cleanup();
  }

  getFolders(): void {
    this._FolderService.getAllFolders().subscribe({
      next: (res) => {
        this.folders = res.data;
      },
      error: (err) => {
        console.error('Error fetching folders:', err);
      },
    });
  }

  getWorkspaces(): void {
    this._WorkspaceService.getWorkspaces().subscribe({
      next: (res) => {
        this.workspaces = res.data;
      },
      error: (err) => {
        console.error('Error fetching workspaces:', err);
      },
    });
  }

  triggerFileSelect(): void {
    this.fileInput.nativeElement.click();
  }

  onFileInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const files = Array.from(input.files);
      this.processFiles(files);
    }
  }

  onFileSelect(event: any): void {
    if (event.files && event.files.length > 0) {
      this.processFiles(event.files);
    }
  }

  private processFiles(files: File[]): void {
    const validFiles = files.filter((file) => this.validateFile(file));
    if (validFiles.length > 0) {
      this.uploadedFiles = [...this.uploadedFiles, ...validFiles];
      validFiles.forEach((file) => {
        this.formData.append('files', file);
      });
      this.messageService.add({
        severity: 'info',
        summary: 'Files Selected',
        detail: `${validFiles.length} file(s) added`,
      });
    }
  }

  private validateFile(file: File): boolean {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = [
      '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx',
      '.jpg', '.jpeg', '.png', '.mp4', '.webm', '.mp3', '.wav', '.ogg'
    ];
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();

    if (!allowedTypes.includes(fileExtension)) {
      this.messageService.add({
        severity: 'error',
        summary: 'Invalid File Type',
        detail: `File ${file.name} is not supported`,
      });
      return false;
    }

    if (file.size > maxSize) {
      this.messageService.add({
        severity: 'error',
        summary: 'File Too Large',
        detail: `File ${file.name} exceeds 10MB limit`,
      });
      return false;
    }

    return true;
  }

  removeFile(index: number, event: Event): void {
    event.stopPropagation();
    this.uploadedFiles.splice(index, 1);
    this.formData = new FormData();
    this.uploadedFiles.forEach((file) => {
      this.formData.append('files', file);
    });
    this.messageService.add({
      severity: 'info',
      summary: 'File Removed',
      detail: 'File removed from selection',
    });
  }

  getFileIcon(fileName: string): string {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return 'pi pi-file-pdf text-red-500';
      case 'doc':
      case 'docx':
        return 'pi pi-file-word text-blue-500';
      case 'xls':
      case 'xlsx':
        return 'pi pi-file-excel text-green-500';
      case 'ppt':
      case 'pptx':
        return 'pi pi-file text-orange-500';
      case 'jpg':
      case 'jpeg':
      case 'png':
        return 'pi pi-image text-purple-500';
      case 'mp4':
      case 'webm':
        return 'pi pi-video text-blue-600';
      case 'mp3':
      case 'wav':
      case 'ogg':
        return 'pi pi-volume-up text-green-600';
      default:
        return 'pi pi-file text-gray-500';
    }
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  getMediaTypeLabel(type: string): string {
    if (type.startsWith('image/')) return 'Photo';
    if (type.startsWith('video/')) return 'Video';
    if (type.startsWith('audio/')) return 'Audio';
    return '';
  }

  // Media capture methods
  openMediaCapture(type: 'photo' | 'video' | 'audio'): void {
    this.mediaType = type;
    this.showMediaCapture = true;
    this.resetMediaState();
  }

  closeMediaCapture(): void {
    this.cleanup();
    this.showMediaCapture = false;
    this.mediaType = null;
    this.resetMediaState();
  }

  getMediaIcon(): string {
    switch (this.mediaType) {
      case 'photo': return 'pi pi-camera';
      case 'video': return 'pi pi-video';
      case 'audio': return 'pi pi-microphone';
      default: return 'pi pi-file';
    }
  }

  getMediaTitle(): string {
    switch (this.mediaType) {
      case 'photo': return 'Take Photo';
      case 'video': return 'Record Video';
      case 'audio': return 'Record Audio';
      default: return 'Media Capture';
    }
  }

  // Camera methods
  async startCamera(): Promise<void> {
    try {
      this.isProcessing = true;
      const constraints = {
        video: this.mediaType === 'photo' || this.mediaType === 'video',
        audio: this.mediaType === 'video'
      };

      this.mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (this.videoElement && (this.mediaType === 'photo' || this.mediaType === 'video')) {
        this.videoElement.nativeElement.srcObject = this.mediaStream;
        this.cameraActive = true;
      }

      this.isProcessing = false;
      this.messageService.add({
        severity: 'success',
        summary: 'Camera Started',
        detail: 'Camera is now active',
      });
    } catch (error) {
      this.isProcessing = false;
      console.error('Error accessing camera:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Camera Error',
        detail: 'Unable to access camera. Please check permissions.',
      });
    }
  }

  capturePhoto(): void {
    if (!this.videoElement || !this.cameraActive) return;

    try {
      const video = this.videoElement.nativeElement;
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        this.capturedPhoto = canvas.toDataURL('image/jpeg', 0.8);
      }

      this.messageService.add({
        severity: 'success',
        summary: 'Photo Captured',
        detail: 'Photo captured successfully',
      });
    } catch (error) {
      console.error('Error capturing photo:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Capture Error',
        detail: 'Failed to capture photo',
      });
    }
  }

  retakePhoto(): void {
    this.capturedPhoto = null;
  }

  savePhoto(): void {
    if (!this.capturedPhoto) return;

    try {
      // Convert base64 to blob
      const byteCharacters = atob(this.capturedPhoto.split(',')[1]);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'image/jpeg' });

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const file = new File([blob], `photo-${timestamp}.jpg`, { type: 'image/jpeg' });

      this.uploadedFiles.push(file);
      this.formData.append('files', file);

      this.messageService.add({
        severity: 'success',
        summary: 'Photo Saved',
        detail: 'Photo added to upload queue',
      });

      this.closeMediaCapture();
    } catch (error) {
      console.error('Error saving photo:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Save Error',
        detail: 'Failed to save photo',
      });
    }
  }

  // Video recording methods
  startVideoRecording(): void {
    if (!this.mediaStream) return;

    try {
      this.recordedChunks = [];
      this.mediaRecorder = new MediaRecorder(this.mediaStream);

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.recordedChunks.push(event.data);
        }
      };

      this.mediaRecorder.onstop = () => {
        this.saveVideoRecording();
      };

      this.mediaRecorder.start();
      this.isRecording = true;
      this.startRecordingTimer();

      this.messageService.add({
        severity: 'info',
        summary: 'Recording Started',
        detail: 'Video recording in progress',
      });
    } catch (error) {
      console.error('Error starting video recording:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Recording Error',
        detail: 'Failed to start video recording',
      });
    }
  }

  stopVideoRecording(): void {
    if (this.mediaRecorder && this.isRecording) {
      this.mediaRecorder.stop();
      this.isRecording = false;
      this.stopRecordingTimer();
    }
  }

  private saveVideoRecording(): void {
    if (this.recordedChunks.length === 0) return;

    try {
      const blob = new Blob(this.recordedChunks, { type: 'video/webm' });
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const file = new File([blob], `video-${timestamp}.webm`, { type: 'video/webm' });

      this.uploadedFiles.push(file);
      this.formData.append('files', file);

      this.messageService.add({
        severity: 'success',
        summary: 'Video Saved',
        detail: 'Video recording added to upload queue',
      });

      this.closeMediaCapture();
    } catch (error) {
      console.error('Error saving video:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Save Error',
        detail: 'Failed to save video recording',
      });
    }
  }

  // Audio recording methods
  async startAudioRecording(): Promise<void> {
    try {
      this.isProcessing = true;
      this.mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });

      this.recordedChunks = [];
      this.mediaRecorder = new MediaRecorder(this.mediaStream);

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.recordedChunks.push(event.data);
        }
      };

      this.mediaRecorder.onstop = () => {
        this.processAudioRecording();
      };

      this.mediaRecorder.start();
      this.isRecording = true;
      this.isProcessing = false;
      this.startRecordingTimer();
      this.startAudioVisualization();

      this.messageService.add({
        severity: 'info',
        summary: 'Recording Started',
        detail: 'Audio recording in progress',
      });
    } catch (error) {
      this.isProcessing = false;
      console.error('Error starting audio recording:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Recording Error',
        detail: 'Unable to access microphone. Please check permissions.',
      });
    }
  }

  stopAudioRecording(): void {
    if (this.mediaRecorder && this.isRecording) {
      this.mediaRecorder.stop();
      this.isRecording = false;
      this.stopRecordingTimer();
      this.stopAudioVisualization();
    }
  }

  private processAudioRecording(): void {
    if (this.recordedChunks.length === 0) return;

    try {
      this.audioBlob = new Blob(this.recordedChunks, { type: 'audio/webm' });
      this.audioUrl = URL.createObjectURL(this.audioBlob);

      this.messageService.add({
        severity: 'success',
        summary: 'Recording Complete',
        detail: 'Audio recorded successfully',
      });
    } catch (error) {
      console.error('Error processing audio:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Processing Error',
        detail: 'Failed to process audio recording',
      });
    }
  }

  retakeAudio(): void {
    this.audioBlob = null;
    this.audioUrl = null;
    if (this.audioUrl) {
      URL.revokeObjectURL(this.audioUrl);
    }
  }

  saveAudio(): void {
    if (!this.audioBlob) return;

    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const file = new File([this.audioBlob], `audio-${timestamp}.MPEG`, { type: 'audio/MPEG' });

      this.uploadedFiles.push(file);
      this.formData.append('files', file);

      this.messageService.add({
        severity: 'success',
        summary: 'Audio Saved',
        detail: 'Audio recording added to upload queue',
      });

      this.closeMediaCapture();
    } catch (error) {
      console.error('Error saving audio:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Save Error',
        detail: 'Failed to save audio recording',
      });
    }
  }

  // Timer methods
  private startRecordingTimer(): void {
    this.recordingStartTime = Date.now();
    this.recordingInterval = setInterval(() => {
      const elapsed = Date.now() - this.recordingStartTime;
      const minutes = Math.floor(elapsed / 60000);
      const seconds = Math.floor((elapsed % 60000) / 1000);
      this.recordingTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }, 1000);
  }

  private stopRecordingTimer(): void {
    if (this.recordingInterval) {
      clearInterval(this.recordingInterval);
      this.recordingInterval = null;
    }
    this.recordingTime = '00:00';
  }

  // Audio visualization
  private initializeAudioWaves(): void {
    this.audioWaves = Array(20).fill(0).map(() => Math.random() * 30 + 10);
  }

  private startAudioVisualization(): void {
    const animateWaves = () => {
      if (this.isRecording) {
        this.audioWaves = this.audioWaves.map(() => Math.random() * 50 + 10);
        setTimeout(animateWaves, 100);
      }
    };
    animateWaves();
  }

  private stopAudioVisualization(): void {
    this.audioWaves = Array(20).fill(10);
  }

  // Cleanup methods
  private resetMediaState(): void {
    this.cameraActive = false;
    this.isRecording = false;
    this.isProcessing = false;
    this.capturedPhoto = null;
    this.audioBlob = null;
    this.audioUrl = null;
    this.recordedChunks = [];
    this.recordingTime = '00:00';
  }

  private cleanup(): void {
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
      this.mediaStream = null;
    }

    if (this.mediaRecorder) {
      this.mediaRecorder = null;
    }

    if (this.recordingInterval) {
      clearInterval(this.recordingInterval);
      this.recordingInterval = null;
    }

    if (this.audioUrl) {
      URL.revokeObjectURL(this.audioUrl);
      this.audioUrl = null;
    }

    this.resetMediaState();
  }

  // Upload methods (existing)
  onUploadClick(): void {
    if (this.uploadedFiles.length === 0) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please select at least one file to upload.',
      });
      return;
    }

    if (!this.selectedFolder && !this.selectedWorkspace && this.folderId === '') {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please select a folder or workspace.',
      });
      return;
    }

    this.isUploading = true;

    if (this.folderId !== '') {
      this._DocumentService.createDocumentInFolder(this.folderId, this.formData).subscribe({
        next: (res) => {
          console.log(res);
          this.handleUploadSuccess();
        },
        error: (err) => {
          console.log(err);
          this.handleUploadError();
        },
      });
    } else {
      if (this.selectedFolder && this.selectedWorkspace) {
        this._DocumentService
          .createDocumentInWorkspaceAndFolder(this.selectedWorkspace.id, this.selectedFolder.id, this.formData)
          .subscribe({
            next: (res) => {
              console.log(res);
              this.handleUploadSuccess();
            },
            error: (err) => {
              console.log(err);
              this.handleUploadError();
            },
          });
      } else if (this.selectedFolder) {
        this._DocumentService.createDocumentInFolder(this.selectedFolder.id, this.formData).subscribe({
          next: (res) => {
            console.log(res);
            this.handleUploadSuccess();
          },
          error: (err) => {
            console.log(err);
            this.handleUploadError();
          },
        });
      } else if (this.selectedWorkspace) {
        this._DocumentService.createDocumentInWorkspace(this.selectedWorkspace.id, this.formData).subscribe({
          next: (res) => {
            console.log(res);
            this.handleUploadSuccess();
          },
          error: (err) => {
            console.log(err);
            this.handleUploadError();
          },
        });
      }
    }
  }

  private handleUploadSuccess(): void {
    this.isUploading = false;
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: `${this.uploadedFiles.length} file(s) uploaded successfully!`,
    });
    this.visible = false;
    this.visibleChange.emit(false);
    this.resetForm();
  }

  private handleUploadError(): void {
    this.isUploading = false;
    this.messageService.add({
      severity: 'error',
      summary: 'Upload Failed',
      detail: 'Failed to upload files. Please try again.',
    });
  }

  resetForm(): void {
    this.uploadedFiles = [];
    this.selectedFolder = null;
    this.selectedWorkspace = null;
    this.formData = new FormData();
    this.isUploading = false;
    this.cleanup();

    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }

    if (this.fileUpload) {
      this.fileUpload.clear();
    }
  }
}
