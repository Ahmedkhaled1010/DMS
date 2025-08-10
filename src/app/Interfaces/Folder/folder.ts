export interface Folder {
  id: string;
  name: string;
  description?:string;
  parentId?: string;
  createdAt: Date;
  updatedAt?: string;
  parentName?:string;
  workspaceName?:string;
  type?: 'folder';
  documents?:Document[]
  createdBy?:string
}

export interface Document {
  id: string;
  fileName: string;
  privacy?: string;
  folderId?: string;
  fileType: string ;
  size?: number;
  createdAt: string;
  updatedAt?: string;
  folderName?:string;
  workspaceName?:string;
  type: 'document';
}

export type FileSystemItem = Folder | Document;

export interface CreateFolderData {
  name: string;
  description?: string;
}
export interface UpdateFolderData {
  name?: string;
  description?: string;
}

export interface CreateDocumentData {
  name: string;
  content?: string;
  folderId?: string;
  fileType: 'pdf' | 'doc' | 'txt' | 'image' | 'other';
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}
export interface FolderData {
  name: string
  id: string
}
export type FolderContentItem = Document | Folder

export interface FolderCriteria {
  name?: string;
  description?: string;
  userNationalID?: string;
  workspaceId?: string;
  isDeleted?: boolean;
  sortField?: string;      // default in Java was "fileName"
  sortDirection?: string;  // default in Java was "asc"
  pageNum?: number;        // default in Java was 1
  pageSize?: number;       // default in Java was 10
}

