import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../Services/Auth/auth.service';
import { DocumentService } from '../Services/Document/document.service';
import { WorkspaceService } from '../Services/Workspace/workspace.service';
import { FolderService } from '../Services/Folder/folder.service';
import { MessageService } from '../Services/Message/message.service';
import { ThemeService } from '../Services/Theme/theme.service';
import { DocumentNavigationService } from '../Services/DocumentNavigation/document-navigation.service';
import { User } from '../Interfaces/User/user';
import { Subscription } from 'rxjs';

interface DashboardStats {
  totalDocuments: number;
  workspaces: number;
  folders: number;
  sharedDocuments: number;
  publicDocuments: number;
  archivedDocuments: number;
  deletedDocuments: number;
  messages: number;
}

interface PricingPlan {
  name: string;
  price: number;
  storage: string;
  features: string[];
  popular?: boolean;
}

@Component({
  selector: 'app-first-page-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './first-page-component.component.html',
  styleUrl: './first-page-component.component.scss'
})
export class FirstPageComponentComponent {
 userData: User | null = null;
  showPricingModal: boolean = false;
  isDarkMode: boolean = false;
  
  // Storage Information
  usedStorage: number = 2.3;
  totalStorage: number = 5;
  storagePercentage: number = 0;
  remainingStorage: number = 0;
  
  // Dashboard Statistics
  dashboardStats: DashboardStats = {
    totalDocuments: 0,
    workspaces: 0,
    folders: 0,
    sharedDocuments: 0,
    publicDocuments: 0,
    archivedDocuments: 0,
    deletedDocuments: 0,
    messages: 0
  };
  
  // Pricing Plans
  pricingPlans: PricingPlan[] = [
    {
      name: 'FREE',
      price: 0,
      storage: '5GB',
      features: ['Basic Features', 'Email Support', '5GB Storage']
    },
    {
      name: 'BASIC',
      price: 9.99,
      storage: '50GB',
      features: ['Advanced Features', 'Priority Support', '50GB Storage', 'Team Collaboration'],
      popular: true
    },
    {
      name: 'PREMIUM',
      price: 19.99,
      storage: 'Unlimited',
      features: ['All Features', '24/7 Support', 'Unlimited Storage', 'Advanced Analytics', 'API Access']
    }
  ];
  
  private subscriptions: Subscription[] = [];
  
  constructor(
    private router: Router,
    private authService: AuthService,
    private documentService: DocumentService,
    private workspaceService: WorkspaceService,
    private folderService: FolderService,
    private messageService: MessageService,
    private themeService: ThemeService,
    private documentNavService: DocumentNavigationService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}
  
  ngOnInit(): void {
    this.loadUserData();
    this.loadDashboardStats();
    this.calculateStorageInfo();

    // Subscribe to theme changes
    const themeSub = this.themeService.theme$.subscribe(theme => {
      this.isDarkMode = theme === 'dark';
    });
    this.subscriptions.push(themeSub);
  }
  
  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
  
  private loadUserData(): void {
    // Subscribe to user details from AuthService
    const userSub = this.authService.UserDetails.subscribe(user => {
      if (user) {
        this.userData = user;
        this.updateStorageBasedOnPlan();
      }
    });
    this.subscriptions.push(userSub);
    
    // If user data is not available, try to fetch it
    if (!this.userData && isPlatformBrowser(this.platformId)) {
      const fetchUserSub = this.authService.getMe().subscribe({
        next: (response) => {
          if (response?.data) {
            this.userData = response.data;
            this.authService.UserDetails.next(response.data);
          }
        },
        error: (error) => {
          console.error('Error fetching user data:', error);
        }
      });
      this.subscriptions.push(fetchUserSub);
    }
  }
  
  private loadDashboardStats(): void {
    // Load documents stats
    this.loadDocumentStats();
    
    // Load workspaces stats
    this.loadWorkspaceStats();
    
    // Load folders stats
    this.loadFolderStats();
    
    // Load messages stats
    this.loadMessageStats();
  }
  
  private loadDocumentStats(): void {
    // You'll need to implement these methods in your DocumentService
    // For now, using mock data
    this.dashboardStats.totalDocuments = 42;
    this.dashboardStats.sharedDocuments = 8;
    this.dashboardStats.publicDocuments = 12;
    this.dashboardStats.archivedDocuments = 15;
    this.dashboardStats.deletedDocuments = 3;
  }
  
  private loadWorkspaceStats(): void {
    // Mock data - replace with actual service calls
    this.dashboardStats.workspaces = 6;
  }
  
  private loadFolderStats(): void {
    // Mock data - replace with actual service calls
    this.dashboardStats.folders = 18;
  }
  
  private loadMessageStats(): void {
    // Mock data - replace with actual service calls
    this.dashboardStats.messages = 24;
  }
  
  private calculateStorageInfo(): void {
    // Update storage info based on user's plan
    this.updateStorageBasedOnPlan();
    
    // Calculate storage percentage and remaining storage
    if (this.totalStorage > 0) {
      this.storagePercentage = Math.round((this.usedStorage / this.totalStorage) * 100);
      this.remainingStorage = this.totalStorage - this.usedStorage;
    }
  }
  
  private updateStorageBasedOnPlan(): void {
    if (!this.userData?.budget) return;
    
    switch (this.userData.budget.toUpperCase()) {
      case 'FREE':
        this.totalStorage = 5;
        break;
      case 'BASIC':
        this.totalStorage = 50;
        break;
      case 'PREMIUM':
        this.totalStorage = 1000; // Representing "unlimited" as 1TB
        break;
      default:
        this.totalStorage = 5;
    }
    
    // Recalculate storage info
    this.storagePercentage = Math.round((this.usedStorage / this.totalStorage) * 100);
    this.remainingStorage = Math.max(0, this.totalStorage - this.usedStorage);
  }
  
  // Navigation methods
  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
  
  // Utility methods
  getInitials(name: string | undefined): string {
    if (!name) return 'U';
    
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
  }
  
  // Pricing modal methods
  selectPlan(planName: string): void {
    // Here you would typically integrate with a payment processor
    // For now, we'll just show an alert and close the modal
    
    if (planName === 'FREE') {
      // Handle downgrade to free
      this.handlePlanChange(planName);
    } else {
      // Handle upgrade to paid plan
      this.handlePurchase(planName);
    }
  }
  
  private handlePlanChange(planName: string): void {
    // Update user's plan in the backend
    // This is a mock implementation
    
    if (this.userData) {
      this.userData.budget = planName;
      this.updateStorageBasedOnPlan();
    }
    
    this.showPricingModal = false;
    
    // Show success message (you might want to use a toast service)
    alert(`Successfully changed to ${planName} plan!`);
  }
  
  private handlePurchase(planName: string): void {
    // Redirect to payment processor or show payment form
    // This is where you'd integrate with Stripe, PayPal, etc.
    
    const selectedPlan = this.pricingPlans.find(plan => plan.name === planName);
    if (selectedPlan) {
      // For demo purposes, just show an alert
      alert(`Redirecting to payment for ${planName} plan ($${selectedPlan.price}/month)`);
      
      // In a real app, you would:
      // 1. Redirect to payment processor
      // 2. Handle payment success/failure
      // 3. Update user's subscription in backend
      // 4. Update local user data
      
      // Mock successful payment
      setTimeout(() => {
        this.handlePlanChange(planName);
      }, 2000);
    }
    
    this.showPricingModal = false;
  }
  
  // Quick action methods
  createNewDocument(): void {
    // Navigate to document creation page or show modal
    this.router.navigate(['/home/Documents']);
  }
  
  createNewWorkspace(): void {
    // Navigate to workspace creation page or show modal
    this.router.navigate(['/home/workspaces']);
  }
  
  createNewFolder(): void {
    // Navigate to folder creation page or show modal
    this.router.navigate(['/home/Folders']);
  }
  
  uploadFiles(): void {
    // Show file upload modal or navigate to upload page
    // You might want to implement a file upload service
    console.log('Upload files functionality');
  }
  
  // Format storage size for display
  formatStorageSize(sizeInGB: number): string {
    if (sizeInGB >= 1000) {
      return `${(sizeInGB / 1000).toFixed(1)}TB`;
    }
    return `${sizeInGB}GB`;
  }
  
  // Get storage color based on usage percentage
  getStorageColor(): string {
    if (this.storagePercentage >= 90) return 'bg-red-500';
    if (this.storagePercentage >= 70) return 'bg-yellow-500';
    return 'bg-blue-500';
  }
  
  // Refresh dashboard data
  refreshDashboard(): void {
    this.loadDashboardStats();
    this.calculateStorageInfo();
  }

  // Example methods for document preview
  previewSamplePDF(): void {
    const samplePDFBase64 = 'JVBERi0xLjQKMSAwIG9iago8PAovVHlwZSAvQ2F0YWxvZwovUGFnZXMgMiAwIFIKPj4KZW5kb2JqCjIgMCBvYmoKPDwKL1R5cGUgL1BhZ2VzCi9LaWRzIFszIDAgUl0KL0NvdW50IDEKPD4KZW5kb2JqCjMgMCBvYmoKPDwKL1R5cGUgL1BhZ2UKL1BhcmVudCAyIDAgUgovTWVkaWFCb3ggWzAgMCA2MTIgNzkyXQovUmVzb3VyY2VzIDw8Ci9Gb250IDw8Ci9GMSA0IDAgUgo+Pgo+PgovQ29udGVudHMgNSAwIFIKPj4KZW5kb2JqCjQgMCBvYmoKPDwKL1R5cGUgL0ZvbnQKL1N1YnR5cGUgL1R5cGUxCi9CYXNlRm9udCAvSGVsdmV0aWNhCj4+CmVuZG9iago1IDAgb2JqCjw8Ci9MZW5ndGggNDQKPj4Kc3RyZWFtCkJUCi9GMSA0OCBUZgoxMDAgNzAwIFRkCihIZWxsbyBXb3JsZCEpIFRqCkVUCmVuZHN0cmVhbQplbmRvYmoKeHJlZgowIDYKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDA5IDAwMDAwIG4gCjAwMDAwMDAwNzQgMDAwMDAgbiAKMDAwMDAwMDEyMCAwMDAwMCBuIAowMDAwMDAwMjc3IDAwMDAwIG4gCjAwMDAwMDAzNzkgMDAwMDAgbiAKdHJhaWxlcgo8PAovU2l6ZSA2Ci9Sb290IDEgMCBSCj4+CnN0YXJ0eHJlZgo0NzMKJSVFT0Y=';

    const documentData = {
      base64: samplePDFBase64,
      fileName: 'sample.pdf',
      fileType: 'pdf',
      mimeType: 'application/pdf'
    };

    this.documentNavService.navigateToDocumentReview(documentData);
  }

  previewSampleImage(): void {
    // Simple 1x1 pixel PNG in base64
    const sampleImageBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChAHqkgC1ggAAAABJRU5ErkJggg==';

    const documentData = {
      base64: sampleImageBase64,
      fileName: 'sample.png',
      fileType: 'png',
      mimeType: 'image/png'
    };

    this.documentNavService.navigateToDocumentReview(documentData);
  }

  previewSampleText(): void {
    // "Hello World! This is a sample text document for testing the document review component." in base64
    const sampleTextBase64 = 'SGVsbG8gV29ybGQhIFRoaXMgaXMgYSBzYW1wbGUgdGV4dCBkb2N1bWVudCBmb3IgdGVzdGluZyB0aGUgZG9jdW1lbnQgcmV2aWV3IGNvbXBvbmVudC4=';

    const documentData = {
      base64: sampleTextBase64,
      fileName: 'sample.txt',
      fileType: 'txt',
      mimeType: 'text/plain'
    };

    this.documentNavService.navigateToDocumentReview(documentData);
  }
}
