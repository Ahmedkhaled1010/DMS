export interface Folder {
  id: string;
  name: string;
  description?:string;
  parentId?: string;
  createdAt: string;
  updatedAt?: string;
  parentName?:string;
  workspaceName?:string;
  type?: 'folder';
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
