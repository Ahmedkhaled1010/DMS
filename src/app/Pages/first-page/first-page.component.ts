import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../Services/Auth/auth.service';
import { DocumentService } from '../../Services/Document/document.service';
import { WorkspaceService } from '../../Services/Workspace/workspace.service';
import { FolderService } from '../../Services/Folder/folder.service';
import { MessageService } from '../../Services/Message/message.service';
import { ThemeService } from '../../Services/Theme/theme.service';
import { User } from '../../Interfaces/User/user';
import { Subscription } from 'rxjs';
import { DocumentFilter, Privacy } from '../../Interfaces/Document/document';

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
  selector: 'app-first-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './first-page.component.html',
  styleUrl: './first-page.component.scss'
})
export class FirstPageComponent implements OnInit, OnDestroy {
  userData: User | null = null;
  showPricingModal: boolean = false;
  isDarkMode: boolean = false;
    selectedPrivacy: Privacy  = Privacy.PUBLIC;
  
  // Storage Information
  usedStorage: number =0;
  totalStorage: number = 0;
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
          console.log(response);
          
          if (response?.data) {
            this.userData = response.data;
            this.authService.UserDetails.next(response.data);
            this.totalStorage=this.userData?.maxSize!/1024;
            this.usedStorage=this.userData?.userSize!/1024;
            this.calculateStorageInfo()
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
    this.getAllDocument()
    this.getAllWorkspace()
    this.getAllFolder()
  }
  
 
  getAllWorkspace()
    {
        this.workspaceService.getAllWorkspace().subscribe({
          next:(res)=>{
            console.log(res);
            this.dashboardStats.workspaces =res.data.length
            
          }
        })
    }
    getAllFolder()
    {
      this.folderService.getAllFolders().subscribe({
        next:(res)=>{
          console.log(res);
        this.dashboardStats.folders=res.data.length
          
        }
      })
    }
    getAllDocument()
    {
      let data:any[]
      let Privacy="PUBLIC"
       const filter: DocumentFilter = {
           
          
          };
      this.documentService.getAllDocumentUser(filter).subscribe({
        next:(res)=>{
          console.log(res);
          this.dashboardStats.totalDocuments=res.data.length
  
        }
      })
  const filter1: DocumentFilter = {
           
          privacy:this.selectedPrivacy|| undefined,
          };
  this.documentService.getAllDocumentUser(filter1).subscribe({
        next:(res)=>{
          console.log(res);
        this.dashboardStats.publicDocuments=res.data.length
  
        }
      })
      this.documentService.getAllDeletedDocuments().subscribe({
        next:(res)=>{
         this.dashboardStats.deletedDocuments=res.data.length
        }
      })
      this.documentService.getAllArchivedDocuments().subscribe({
        next:(res)=>{
          this.dashboardStats.archivedDocuments=res.data.length
        }
      })
  
    }
    getAllChats()
    {
      this.messageService.getAllChats().subscribe(
        {
          next:(res)=>{
            console.log(res);
            this.dashboardStats.messages=res.data.length
          }
        }
      )
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
        this.totalStorage = 10;
        break;
      case 'BASIC':
        this.totalStorage = 20;
        break;
      case 'PREMIUM':
        this.totalStorage = 50; // Representing "unlimited" as 1TB
        break;
      default:
        this.totalStorage = 0;
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
}
