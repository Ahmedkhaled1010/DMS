import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { User, Workspace, Folder, Document, Payment, DashboardStats, Notification } from '../../Interfaces/Admin/admin';
import { HttpClient } from '@angular/common/http';
import { Notify } from '../../Interfaces/Message/message';

interface ChartData {
  name: string;
  value: number;
  color: string;
}

interface TimeSeriesData {
  date: string;
  users: number;
  documents: number;
  revenue: number;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private usersSubject = new BehaviorSubject<User[]>([]);
  private workspacesSubject = new BehaviorSubject<Workspace[]>([]);
  private foldersSubject = new BehaviorSubject<Folder[]>([]);
  private documentsSubject = new BehaviorSubject<Document[]>([]);
  private paymentsSubject = new BehaviorSubject<Payment[]>([]);

  constructor(private _HttpClient:HttpClient) {
    this.initializeMockData();
  }

  private initializeMockData() {
    // Mock Users Data
    const mockUsers: User[] = [
      {
        id: '1',
        name: 'John Doe',
        userName: 'johndoe',
        email: 'john@example.com',
        mobileNumber: '+1234567890',
        profileImage: '/placeholder.svg?height=40&width=40',
        isAdmin: false,
        isActive: true,
        joinDate: new Date('2023-01-15'),
        lastLogin: new Date('2024-01-06'),
        totalWorkspaces: 3,
        totalDocuments: 45,
        totalFolders: 12,
        subscription: 'premium'
      },
      {
        id: '2',
        name: 'Jane Smith',
        userName: 'janesmith',
        email: 'jane@example.com',
        mobileNumber: '+1234567891',
        profileImage: '/placeholder.svg?height=40&width=40',
        isAdmin: true,
        isActive: true,
        joinDate: new Date('2023-02-20'),
        lastLogin: new Date('2024-01-05'),
        totalWorkspaces: 5,
        totalDocuments: 78,
        totalFolders: 20,
        subscription: 'enterprise'
      },
      {
        id: '3',
        name: 'Mike Johnson',
        userName: 'mikej',
        email: 'mike@example.com',
        mobileNumber: '+1234567892',
        profileImage: '/placeholder.svg?height=40&width=40',
        isAdmin: false,
        isActive: false,
        joinDate: new Date('2023-03-10'),
        lastLogin: new Date('2023-12-20'),
        totalWorkspaces: 1,
        totalDocuments: 12,
        totalFolders: 3,
        subscription: 'free'
      }
    ];

    // Mock Workspaces Data
    const mockWorkspaces: Workspace[] = [
      {
        id: '1',
        name: 'Marketing Campaign 2024',
        description: 'All marketing materials and campaigns for 2024',
        ownerId: '1',
        ownerName: 'John Doe',
        createdDate: new Date('2023-06-15'),
        lastModified: new Date('2024-01-05'),
        totalDocuments: 25,
        totalFolders: 5,
        isPublic: false,
        members: 8
      },
      {
        id: '2',
        name: 'Product Development',
        description: 'Product specifications and development docs',
        ownerId: '2',
        ownerName: 'Jane Smith',
        createdDate: new Date('2023-07-20'),
        lastModified: new Date('2024-01-04'),
        totalDocuments: 40,
        totalFolders: 8,
        isPublic: true,
        members: 12
      }
    ];

    // Mock Payments Data
    const mockPayments: Payment[] = [
      {
        id: '1',
        userId: '1',
        userName: 'John Doe',
        userEmail: 'john@example.com',
        amount: 29.99,
        currency: 'USD',
        plan: 'Premium Monthly',
        status: 'completed',
        paymentDate: new Date('2024-01-01'),
        paymentMethod: 'Credit Card',
        transactionId: 'txn_1234567890'
      },
      {
        id: '2',
        userId: '2',
        userName: 'Jane Smith',
        userEmail: 'jane@example.com',
        amount: 99.99,
        currency: 'USD',
        plan: 'Enterprise Monthly',
        status: 'completed',
        paymentDate: new Date('2024-01-02'),
        paymentMethod: 'PayPal',
        transactionId: 'txn_0987654321'
      }
    ];

    // Mock Documents Data
    const mockDocuments: Document[] = [
      {
        id: '1',
        name: 'Marketing Strategy 2024.pdf',
        type: 'pdf',
        size: 2048576, // 2MB
        folderId: '1',
        folderName: 'Marketing Plans',
        workspaceId: '1',
        workspaceName: 'Marketing Campaign 2024',
        ownerId: '1',
        ownerName: 'John Doe',
        createdDate: new Date('2023-12-01'),
        lastModified: new Date('2024-01-03'),
        isPublic: false,
        isDeleted: false,
        isArchived: false,
        downloads: 45,
        views: 128
      },
      {
        id: '2',
        name: 'Product Roadmap.docx',
        type: 'docx',
        size: 1024000, // 1MB
        folderId: '2',
        folderName: 'Product Docs',
        workspaceId: '2',
        workspaceName: 'Product Development',
        ownerId: '2',
        ownerName: 'Jane Smith',
        createdDate: new Date('2023-11-15'),
        lastModified: new Date('2024-01-02'),
        isPublic: true,
        isDeleted: false,
        isArchived: false,
        downloads: 89,
        views: 234
      },
      {
        id: '3',
        name: 'Budget Analysis.xlsx',
        type: 'xlsx',
        size: 512000, // 512KB
        folderId: '3',
        folderName: 'Financial Reports',
        workspaceId: '1',
        workspaceName: 'Marketing Campaign 2024',
        ownerId: '1',
        ownerName: 'John Doe',
        createdDate: new Date('2023-10-20'),
        lastModified: new Date('2023-12-15'),
        isPublic: false,
        isDeleted: true,
        isArchived: false,
        downloads: 23,
        views: 67
      }
    ];

    // Mock Folders Data
    const mockFolders: Folder[] = [
      {
        id: '1',
        name: 'Marketing Plans',
        workspaceId: '1',
        workspaceName: 'Marketing Campaign 2024',
        ownerId: '1',
        ownerName: 'John Doe',
        createdDate: new Date('2023-06-20'),
        lastModified: new Date('2024-01-03'),
        totalDocuments: 15,
        isShared: true,
        isDeleted: false,
        color: '#3b82f6'
      },
      {
        id: '2',
        name: 'Product Docs',
        workspaceId: '2',
        workspaceName: 'Product Development',
        ownerId: '2',
        ownerName: 'Jane Smith',
        createdDate: new Date('2023-07-25'),
        lastModified: new Date('2024-01-02'),
        totalDocuments: 28,
        isShared: false,
        isDeleted: false,
        color: '#10b981'
      },
      {
        id: '3',
        name: 'Financial Reports',
        workspaceId: '1',
        workspaceName: 'Marketing Campaign 2024',
        ownerId: '1',
        ownerName: 'John Doe',
        createdDate: new Date('2023-08-10'),
        lastModified: new Date('2023-12-15'),
        totalDocuments: 8,
        isShared: true,
        isDeleted: true,
        color: '#f59e0b'
      }
    ];

    this.documentsSubject.next(mockDocuments);
    this.foldersSubject.next(mockFolders);
    this.usersSubject.next(mockUsers);
    this.workspacesSubject.next(mockWorkspaces);
    this.paymentsSubject.next(mockPayments);
  }

  // Dashboard Stats
  getDashboardStats(): Observable<DashboardStats> {
    const users = this.usersSubject.value;
    const workspaces = this.workspacesSubject.value;
    const payments = this.paymentsSubject.value;

    const stats: DashboardStats = {
      totalUsers: users.length,
      totalWorkspaces: workspaces.length,
      totalFolders: users.reduce((sum, user) => sum + user.totalFolders, 0),
      totalDocuments: users.reduce((sum, user) => sum + user.totalDocuments, 0),
      activeUsers: users.filter(u => u.isActive).length,
      premiumUsers: users.filter(u => u.subscription !== 'free').length,
      totalRevenue: payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0),
      monthlyRevenue: payments.filter(p => p.status === 'completed' && p.paymentDate.getMonth() === new Date().getMonth()).reduce((sum, p) => sum + p.amount, 0)
    };

    return of(stats).pipe(delay(500));
  }

  // Users Management
  getUsers(): Observable<User[]> {
    return this.usersSubject.asObservable();
  }

  updateUserAdminStatus(userId: string, isAdmin: boolean): Observable<boolean> {
    const users = this.usersSubject.value;
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
      users[userIndex].isAdmin = isAdmin;
      this.usersSubject.next([...users]);
    }
    return of(true).pipe(delay(500));
  }

  removeUser(userId: string): Observable<boolean> {
    const users = this.usersSubject.value.filter(u => u.id !== userId);
    this.usersSubject.next(users);
    return of(true).pipe(delay(500));
  }

  toggleUserStatus(userId: string): Observable<boolean> {
    const users = this.usersSubject.value;
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
      users[userIndex].isActive = !users[userIndex].isActive;
      this.usersSubject.next([...users]);
    }
    return of(true).pipe(delay(500));
  }

  // Workspaces Management
  getWorkspaces(): Observable<Workspace[]> {
    return this.workspacesSubject.asObservable();
  }

  // Folders Management
  getFolders(): Observable<Folder[]> {
    return this.foldersSubject.asObservable();
  }

  // Documents Management
  getDocuments(): Observable<Document[]> {
    return this.documentsSubject.asObservable();
  }

  // Payments Management
  getPayments(): Observable<Payment[]> {
    return this.paymentsSubject.asObservable();
  }

  // Notifications
  sendNotification(notification: Notification): Observable<boolean> {
    console.log('Sending notification:', notification);
    return of(true).pipe(delay(1000));
  }

  // Add chart data methods
  getDocumentTypeChart(): Observable<ChartData[]> {
    const documents = this.documentsSubject.value.filter(d => !d.isDeleted);
    const typeCount: { [key: string]: number } = {};
    
    documents.forEach(doc => {
      typeCount[doc.type] = (typeCount[doc.type] || 0) + 1;
    });

    const chartData: ChartData[] = Object.entries(typeCount).map(([type, count]) => ({
      name: type.toUpperCase(),
      value: count,
      color: this.getTypeColor(type)
    }));

    return of(chartData).pipe(delay(300));
  }

  getUserGrowthChart(): Observable<TimeSeriesData[]> {
    const data: TimeSeriesData[] = [
      { date: '2023-08', users: 45, documents: 234, revenue: 1250 },
      { date: '2023-09', users: 52, documents: 289, revenue: 1480 },
      { date: '2023-10', users: 61, documents: 356, revenue: 1720 },
      { date: '2023-11', users: 73, documents: 445, revenue: 2100 },
      { date: '2023-12', users: 89, documents: 567, revenue: 2650 },
      { date: '2024-01', users: 108, documents: 698, revenue: 3200 }
    ];

    return of(data).pipe(delay(300));
  }

  private getTypeColor(type: string): string {
    const colors: { [key: string]: string } = {
      'pdf': '#ef4444',
      'docx': '#3b82f6',
      'xlsx': '#10b981',
      'pptx': '#f59e0b',
      'txt': '#6b7280',
      'jpg': '#8b5cf6',
      'png': '#ec4899'
    };
    return colors[type] || '#6b7280';
  }
  getAllUser():Observable<any>
  {
   return   this._HttpClient.get(`admin/allUsers`)
  }
  createAdmin(nationalID:string):Observable<any>
  {
    const body={
      nationalID:nationalID
    }
    return this._HttpClient.post(`admin/createAdmin`,body)
  }
   removeAdmin(nationalID:string):Observable<any>
  {
    const body={
      nationalID:nationalID
    }
    return this._HttpClient.post(`admin/deleteAdmin`,body)
  }
  getAllWorkspace():Observable<any>
  {
    return this._HttpClient.get(`admin/allWorkSpace`)
  }
  getAllFolder():Observable<any>
  {
    return this._HttpClient.get(`admin/allFolders`)
  }
  getAllDocument():Observable<any>
  {
    return this._HttpClient.get(`admin/allDocuments`)
  }
  notifyUser(notify:Notify):Observable<any>
  {
    return  this._HttpClient.post(`admin/sendNotification`,notify)
  }
 
}
