export interface User {
  id: string;
  name: string;
  userName: string;
  email: string;
  mobileNumber: string;
  profileImage: string;
  isAdmin: boolean;
  isActive: boolean;
  joinDate: Date;
  lastLogin: Date;
  totalWorkspaces: number;
  totalDocuments: number;
  totalFolders: number;
  subscription: 'free' | 'premium' | 'enterprise';
}

export interface Workspace {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  ownerName: string;
  createdDate: Date;
  lastModified: Date;
  totalDocuments: number;
  totalFolders: number;
  isPublic: boolean;
  members: number;
}

export interface Folder {
  id: string;
  name: string;
  workspaceId: string;
  workspaceName: string;
  ownerId: string;
  ownerName: string;
  createdDate: Date;
  lastModified: Date;
  totalDocuments: number;
  isShared: boolean;
  isDeleted: boolean;
  color: string;
}

export interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  folderId: string;
  folderName: string;
  workspaceId: string;
  workspaceName: string;
  ownerId: string;
  ownerName: string;
  createdDate: Date;
  lastModified: Date;
  isPublic: boolean;
  isDeleted: boolean;
  isArchived: boolean;
  downloads: number;
  views: number;
}

export interface Payment {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  amount: number;
  currency: string;
  plan: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentDate: Date;
  paymentMethod: string;
  transactionId: string;
}

export interface DashboardStats {
  totalUsers: number;
  totalWorkspaces: number;
  totalFolders: number;
  totalDocuments: number;
  activeUsers: number;
  premiumUsers: number;
  totalRevenue: number;
  monthlyRevenue: number;
}

export interface Notification {
  id?: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  targetUsers: 'all' | 'admins' | 'premium' | 'specific';
  specificUserIds?: string[];
  scheduledDate?: Date;
  isImmediate: boolean;
}

// Add chart data interfaces
export interface ChartData {
  name: string;
  value: number;
  color?: string;
}

export interface TimeSeriesData {
  date: string;
  users: number;
  documents: number;
  revenue: number;
}
