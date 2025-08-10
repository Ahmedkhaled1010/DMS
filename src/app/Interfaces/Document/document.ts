export interface DocumentModel {
  id: string;
  workspaceId: string;
  folderId?: string;
  fileName: string;
  fileType: string;
  filePath: string;
  nationalID: string;
  size: number;
  isDeleted: boolean;
  tag: string;
  privacy: Privacy;
  version: number;
  createdAt?: Date;
  updatedAt?: string;
  folderName?:string;
  workspaceName?:string;
  username?: string;
  createdBy?:string;
  isFavorite?: boolean;

}

export enum Privacy {
  PRIVATE = 'PRIVATE',
  PUBLIC = 'PUBLIC',
  SHARED = 'SHARED'
}

export enum DocumentTag {
  GENERAL = 'GENERAL',
  IMPORTANT = 'IMPORTANT',
  DRAFT = 'DRAFT',
  ARCHIVED = 'ARCHIVED',
  CONFIDENTIAL = 'CONFIDENTIAL'
}

export interface DocumentFilter {
  fileName?: string;
  fileType?: string;
  tag?: string;
  privacy?: Privacy;
  workspaceId?: string;
  folderId?: string;
  isDeleted?: boolean;
  minSize?: number;
  maxSize?: number;
  dateFrom?: string;
  dateTo?: string;
  pageNum?:number;
  pageSize?:number;
  sortField?:string;
  sortDirection?:string;

}

export interface PaginatedResponse<T> {
  data: T[];
  totalRecords: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
}

export interface DocumentTableColumn {
  field: string;
  header: string;
  sortable?: boolean;
  filterable?: boolean;
  width?: string;
  type?: 'text' | 'number' | 'date' | 'boolean' | 'badge' | 'size';
}
export interface DocumentDetailDto {
  id: string;
  workspaceId: string;
  folderId?: string;
  fileName: string;
  fileType: string;
  filePath: string;
  nationalID: string;
  size: number;
  title: string;
  isDeleted: boolean;
  createdAt: string;
  workspaceName: string;
  folderName: string;
  createdBy: string;
  updatedAt?: string;
  updatedBy?: string;
  tag: string;
  privacy: Privacy;
  version: number;
  isFavorite?: boolean;
}

export interface UpdateDocumentRequest {
  fileName?: string;
  title?: string;
  tag?: string;
  privacy?: Privacy;
  folderId?: string;
}

export interface ShareDocumentRequest {
  documentId: string;
  userEmail: string;
  permissions: SharePermission[];
  message?: string;
  expiryDate?: string;
}

export enum SharePermission {
  VIEW = 'VIEW',
  DOWNLOAD = 'DOWNLOAD',
  EDIT = 'EDIT',
  SHARE = 'SHARE'
}

export interface SharedUser {
  id: string;
  email: string;
  name: string;
  permissions: SharePermission[];
  sharedAt: string;
  expiryDate?: string;
  status: 'ACTIVE' | 'EXPIRED' | 'REVOKED';
}

export interface DocumentActivity {
  id: string;
  action: string;
  description: string;
  performedBy: string;
  performedAt: string;
  details?: any;
}
export interface Document {
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
