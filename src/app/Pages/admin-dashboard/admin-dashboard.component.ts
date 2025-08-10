import { AdminService } from './../../Services/Admin/admin.service';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ChartData, DashboardStats, Payment, TimeSeriesData ,Notification } from '../../Interfaces/Admin/admin';
import { User } from '../../Interfaces/User/user';
import { Workspace } from '../../Interfaces/Workspace/workspace';
import { Folder } from '../../Interfaces/Folder/folder';
import { DocumentModel } from '../../Interfaces/Document/document';
import { NavbarComponent } from "../../Component/navbar/navbar.component";

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NavbarComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})
export class AdminDashboardComponent {
 stats: DashboardStats | null = null;
  users: User[] = [];
  workspaces: Workspace[] = [];
  folders: Folder[] = [];
  documents: DocumentModel[] = [];
  payments: Payment[] = [];
  documentTypeChart: ChartData[] = [];
  userGrowthChart: TimeSeriesData[] = [];

  // UI State
  activeView: 'dashboard' | 'users' | 'workspaces' | 'folders' | 'documents' | 'payments' = 'dashboard';
  isDarkMode = false;
  loading = false;
  alertMessage = '';
  alertType = '';

  // Modals
  showNotificationModal = false;
  showConfirmModal = false;
  confirmAction: (() => void) | null = null;
  confirmMessage = '';

  // Forms
  notificationForm: FormGroup=new FormGroup(
    {
      content:new FormControl("",Validators.required),
      title:new FormControl("",Validators.required)
    }
  )

  // Filters and Search
  searchTerm = '';
  userFilter = 'all'; // all, active, inactive, admin, premium
  sortBy = 'name';
  sortOrder: 'asc' | 'desc' = 'asc';
  documentFilter = 'all'; // all, public, private, deleted, archived
  folderFilter = 'all'; // all, shared, private, deleted

  showDocumentModal = false;
  showFolderModal = false;
  selectedDocument: Document | null = null;
  selectedFolder: Folder | null = null;

  // Enhanced notification properties
  showScheduleModal = false;
  scheduledDate: Date | null = null;
  notificationPriority: 'low' | 'normal' | 'high' | 'urgent' = 'normal';
  attachments: File[] = [];
  selectedUsers: string[] = [];
  showAdvancedOptions = false;
  requireReadConfirmation = false;
  allowReplies = false;
  confirmationChecked = false;
  
  notificationTemplates: any[] = [
    { id: 1, name: 'System Maintenance', title: 'Scheduled Maintenance', message: 'We will be performing system maintenance on [DATE]. Please save your work.' },
    { id: 2, name: 'Welcome Message', title: 'Welcome to the Platform', message: 'Welcome! We\'re excited to have you on board. Here\'s how to get started...' },
    { id: 3, name: 'Security Alert', title: 'Security Update Required', message: 'Please update your password to ensure account security.' }
  ];

  // Document preview properties
  showDocumentPreview = false;
  documentPreviewUrl = '';
  documentVersions: any[] = [];
  documentComments: any[] = [];
  documentTags: string[] = [];
  documentPermissions: any[] = [];

  // Folder properties
  folderMembers: any[] = [];
  folderActivity: any[] = [];
  subFolders: any[] = [];

  // Bulk operations
  selectedDocuments: Set<string> = new Set();
  selectedFolders: Set<string> = new Set();
  showBulkActions = false;

  constructor(
    private adminService: AdminService,
    private fb: FormBuilder
  ) {
   
  }

  ngOnInit() {
    this.loadDashboardData();
    this.loadChartData();
    this.initialData()
  }

  
  loadChartData() {
    this.adminService.getDocumentTypeChart().subscribe(data => {
      this.documentTypeChart = data;
    });

    this.adminService.getUserGrowthChart().subscribe(data => {
      this.userGrowthChart = data;
    });
  }
  initialData()
  {
    this.getAllUser()
    this.getAllWorkspace()
    this.getAllFolder()
    this.getAllDocument()
  }
  getAllUser()
  {
      this.adminService.getAllUser().subscribe(
        {
          next:(res)=>{
            console.log(res);
            this.users=res.data;
            
          },
          error:(err)=>{
            console.log(err);
            
          }
        }
      )
  }
  getAllWorkspace()
  {
    this.adminService.getAllWorkspace().subscribe(
      {
        next:(res)=>{
          console.log(res);
          this.workspaces=res.data
          
        },
        error:(err)=>{
          console.log(err);
          
        }
      }
    )
  }
  getAllFolder()
  {
    this.adminService.getAllFolder().subscribe(
      {
        next:(res)=>{
          console.log(res);
          this.folders=res.data
        },
        error:(err)=>{
          console.log(err);
          
        }
      }
    )
  }
  getAllDocument()
  {
    this.adminService.getAllDocument().subscribe(
      {
        next:(res)=>{
          console.log(res);
          this.documents=res.data
          
        },
        error:(err)=>{
          console.log(err);
          
        }
      }
    )
  }
  loadDashboardData() {
    this.loading = true;
    
    this.adminService.getDashboardStats().subscribe(stats => {
      this.stats = stats;
      this.loading = false;
    });

    

    

    

    
    this.adminService.getPayments().subscribe(payments => {
      this.payments = payments;
    });
  }

  setActiveView(view: 'dashboard' | 'users' | 'workspaces' | 'folders' | 'documents' | 'payments') {
    this.activeView = view;
    this.searchTerm = '';
  }

  

  makeUserAdmin(userId: string) {
    this.confirmAction = () => {

      this.adminService.createAdmin(userId).subscribe({
        next:(res)=>{
          console.log(res);
           this.showAlert('User promoted to admin successfully', 'success');
           this.getAllUser()
        },
        error:(err)=>{
          console.log(err);
          
        }
      })
     
    };
    this.confirmMessage = 'Are you sure you want to make this user an admin?';
    this.showConfirmModal = true;
  }

  removeAdminStatus(userId: string) {
    this.confirmAction = () => {
      this.adminService.removeAdmin(userId).subscribe({
        next:(res)=>{
          console.log(res);
           this.showAlert('User promoted to admin successfully', 'success');
           this.getAllUser()
        },
        error:(err)=>{
          console.log(err);
          
        }
      })
     
    };
    this.confirmMessage = 'Are you sure you want to remove admin status from this user?';
    this.showConfirmModal = true;
  }

  removeUser(userId: string) {
    this.confirmAction = () => {
      this.adminService.removeUser(userId).subscribe(() => {
        this.showAlert('User removed successfully', 'success');
      });
    };
    this.confirmMessage = 'Are you sure you want to remove this user? This action cannot be undone.';
    this.showConfirmModal = true;
  }

  toggleUserStatus(userId: string) {
    /*this.adminService.toggleUserStatus(userId).subscribe(() => {
      const user = this.users.find(u => u.id === userId);
      const status = user?.isActive ? 'activated' : 'deactivated';
      this.showAlert(`User ${status} successfully`, 'success');
    });*/
  }

  // Notification Management
  openNotificationModal() {
    this.notificationForm.reset({
      title: '',
      content: '',
    
    });
    this.showNotificationModal = true;
  }

  closeNotificationModal() {
    this.showNotificationModal = false;
    this.clearAlert();
  }

  sendNotification() {
    if (this.notificationForm.valid) {
      this.loading = true;
      
        console.log(this.notificationForm.value);

        this.adminService.notifyUser(this.notificationForm.value).subscribe(
          {
            next:(res)=>{
              console.log(res);
              this.loading = false;
          this.showAlert('Notification sent successfully!', 'success');
          setTimeout(() => {
            this.closeNotificationModal();
          }, 1500);
            },
            error:(err)=>{
              console.log(err);
                this.loading = false;
          this.showAlert('Failed to send notification. Please try again.', 'error');
            }
          }
        )
      
      
    } else {
      this.showAlert('Please fill in all required fields', 'error');
    }
  }

  // Enhanced notification methods
  selectNotificationTemplate(template: any) {
    this.notificationForm.patchValue({
      title: template.title,
      message: template.message
    });
  }

  scheduleNotification() {
    this.showScheduleModal = true;
  }

  closeScheduleModal() {
    this.showScheduleModal = false;
    this.scheduledDate = null;
  }

  confirmSchedule() {
    if (this.scheduledDate) {
      this.notificationForm.patchValue({
        isImmediate: false,
        scheduledDate: this.scheduledDate
      });
      this.closeScheduleModal();
    }
  }

  onFileAttachment(event: any) {
    const files = Array.from(event.target.files) as File[];
    this.attachments = [...this.attachments, ...files];
  }

  removeAttachment(index: number) {
    this.attachments.splice(index, 1);
  }

  saveAsDraft() {
    // Implementation for saving notification as draft
    this.showAlert('Notification saved as draft', 'success');
  }

  // Utility Methods
  confirmModalAction() {
    if (this.confirmAction) {
      this.confirmAction();
      this.confirmAction = null;
    }
    this.showConfirmModal = false;
  }

  cancelConfirmModal() {
    this.confirmAction = null;
    this.showConfirmModal = false;
  }

  showAlert(message: string, type: string) {
    this.alertMessage = message;
    this.alertType = type;
    
    setTimeout(() => {
      this.clearAlert();
    }, 5000);
  }

  clearAlert() {
    this.alertMessage = '';
    this.alertType = '';
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString();
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  getSubscriptionBadgeClass(subscription: string): string {
    switch (subscription) {
      case 'free': return 'badge-secondary';
      case 'premium': return 'badge-primary';
      case 'enterprise': return 'badge-success';
      default: return 'badge-secondary';
    }
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'completed': return 'badge-success';
      case 'pending': return 'badge-warning';
      case 'failed': return 'badge-error';
      case 'refunded': return 'badge-secondary';
      default: return 'badge-secondary';
    }
  }

  

  
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  getFileTypeIcon(type: string): string {
    const icons: { [key: string]: string } = {
      'pdf': '📄',
      'docx': '📝',
      'xlsx': '📊',
      'pptx': '📋',
      'txt': '📃',
      'jpg': '🖼️',
      'png': '🖼️',
      'gif': '🖼️'
    };
    return icons[type] || '📁';
  }

 

  closeDocumentModal() {
    this.showDocumentModal = false;
    this.selectedDocument = null;
  }

  viewFolderDetails(folder: Folder) {
    this.selectedFolder = folder;
    this.loadFolderMembers(folder.id);
    this.loadFolderActivity(folder.id);
    this.showFolderModal = true;
  }

  closeFolderModal() {
    this.showFolderModal = false;
    this.selectedFolder = null;
  }

  

  deleteDocument(documentId: string) {
    this.confirmAction = () => {
      // Find and mark document as deleted
      const documents = this.documents;
      const docIndex = documents.findIndex(d => d.id === documentId);
      if (docIndex !== -1) {
        documents[docIndex].isDeleted = true;
        this.showAlert('Document moved to trash successfully', 'success');
      }
    };
    this.confirmMessage = 'Are you sure you want to delete this document? It will be moved to trash.';
    this.showConfirmModal = true;
  }

  restoreDocument(documentId: string) {
    this.confirmAction = () => {
      // Find and restore document
      const documents = this.documents;
      const docIndex = documents.findIndex(d => d.id === documentId);
      if (docIndex !== -1) {
        documents[docIndex].isDeleted = false;
        this.showAlert('Document restored successfully', 'success');
      }
    };
    this.confirmMessage = 'Are you sure you want to restore this document?';
    this.showConfirmModal = true;
  }

  

  

  

  getDocumentStatusColor(document: Document): string {
  
    return 'var(--text-secondary)';
  }

  // Document enhancements
  previewDocument(document: Document) {
    
  }

  closeDocumentPreview() {
    this.showDocumentPreview = false;
    this.documentPreviewUrl = '';
  }

  loadDocumentVersions(documentId: string) {
    // Mock data - replace with actual API call
    this.documentVersions = [
      { version: '1.3', date: new Date(), author: 'John Doe', size: '2.1 MB', changes: 'Updated content and formatting' },
      { version: '1.2', date: new Date(Date.now() - 86400000), author: 'Jane Smith', size: '2.0 MB', changes: 'Added new sections' },
      { version: '1.1', date: new Date(Date.now() - 172800000), author: 'John Doe', size: '1.9 MB', changes: 'Initial version' }
    ];
  }

  loadDocumentComments(documentId: string) {
    // Mock data - replace with actual API call
    this.documentComments = [
      { id: 1, author: 'Jane Smith', date: new Date(), comment: 'Great work on this document!', avatar: '/placeholder.svg?height=32&width=32' },
      { id: 2, author: 'Mike Johnson', date: new Date(Date.now() - 3600000), comment: 'Could we add more details in section 3?', avatar: '/placeholder.svg?height=32&width=32' }
    ];
  }

  addDocumentComment(comment: string) {
    if (comment.trim()) {
      this.documentComments.unshift({
        id: Date.now(),
        author: 'Current User',
        date: new Date(),
        comment: comment.trim(),
        avatar: '/placeholder.svg?height=32&width=32'
      });
    }
  }

  shareDocument(documentId: string) {
    // Implementation for document sharing
    this.showAlert('Document sharing link copied to clipboard', 'success');
  }

  // Folder enhancements
  loadFolderMembers(folderId: string) {
    // Mock data - replace with actual API call
    this.folderMembers = [
      { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Owner', avatar: '/placeholder.svg?height=32&width=32' },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Editor', avatar: '/placeholder.svg?height=32&width=32' },
      { id: 3, name: 'Mike Johnson', email: 'mike@example.com', role: 'Viewer', avatar: '/placeholder.svg?height=32&width=32' }
    ];
  }

  loadFolderActivity(folderId: string) {
    // Mock data - replace with actual API call
    this.folderActivity = [
      { id: 1, action: 'Document added', user: 'John Doe', item: 'report.pdf', date: new Date(), icon: '📄' },
      { id: 2, action: 'Folder shared', user: 'Jane Smith', item: 'with Mike Johnson', date: new Date(Date.now() - 3600000), icon: '🔗' },
      { id: 3, action: 'Document edited', user: 'Mike Johnson', item: 'presentation.pptx', date: new Date(Date.now() - 7200000), icon: '✏️' }
    ];
  }

  // Bulk operations
  toggleDocumentSelection(documentId: string) {
    if (this.selectedDocuments.has(documentId)) {
      this.selectedDocuments.delete(documentId);
    } else {
      this.selectedDocuments.add(documentId);
    }
    this.showBulkActions = this.selectedDocuments.size > 0 || this.selectedFolders.size > 0;
  }

  toggleFolderSelection(folderId: string) {
    if (this.selectedFolders.has(folderId)) {
      this.selectedFolders.delete(folderId);
    } else {
      this.selectedFolders.add(folderId);
    }
    this.showBulkActions = this.selectedDocuments.size > 0 || this.selectedFolders.size > 0;
  }

  

  bulkDeleteDocuments() {
    this.confirmAction = () => {
      this.selectedDocuments.forEach(docId => {
        const docIndex = this.documents.findIndex(d => d.id === docId);
        if (docIndex !== -1) {
          this.documents[docIndex].isDeleted = true;
        }
      });
      const count = this.selectedDocuments.size;
      this.selectedDocuments.clear();
      this.showBulkActions = false;
      this.showAlert(`${count} documents moved to trash`, 'success');
    };
    this.confirmMessage = `Are you sure you want to delete ${this.selectedDocuments.size} selected documents?`;
    this.showConfirmModal = true;
  }

  bulkRestoreDocuments() {
    const count = this.selectedDocuments.size;
    this.selectedDocuments.forEach(docId => {
      const docIndex = this.documents.findIndex(d => d.id === docId);
      if (docIndex !== -1) {
        this.documents[docIndex].isDeleted = false;
      }
    });
    this.selectedDocuments.clear();
    this.showBulkActions = false;
    this.showAlert(`${count} documents restored`, 'success');
  }

  bulkDownload() {
    this.showAlert('Bulk download started. Files will be compressed and downloaded.', 'info');
  }

  bulkMove() {
    this.showAlert('Move operation initiated. Select destination folder.', 'info');
  }

  bulkArchive() {
    const count = this.selectedDocuments.size;
  
    this.selectedDocuments.clear();
    this.showBulkActions = false;
    this.showAlert(`${count} documents archived`, 'success');
  }

  clearSelection() {
    this.selectedDocuments.clear();
    this.selectedFolders.clear();
    this.showBulkActions = false;
  }

  exportDocuments() {
    // Implementation for exporting documents
    this.showAlert('Export started. You will receive an email when ready.', 'info');
  }
// في TypeScript component
setScheduledDate(hours: number) {
  this.scheduledDate = new Date(Date.now() + hours * 60 * 60 * 1000);
}

  
}
