import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Folder, ApiResponse, CreateFolderData, CreateDocumentData, Document, UpdateFolderData, FolderData } from '../../Interfaces/Folder/folder';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FolderService {

   private foldersSubject = new BehaviorSubject<Folder[]>([]);
  private documentsSubject = new BehaviorSubject<Document[]>([]);
  folderData: BehaviorSubject<FolderData[]> = new BehaviorSubject<FolderData[]>([]);
  
  public folders$ = this.foldersSubject.asObservable();
  public documents$ = this.documentsSubject.asObservable();
  public isCreateModalOpen = new BehaviorSubject<boolean>(false);
  public createType = new BehaviorSubject<'folder' | 'document'>('folder');
  public folderCreated = new BehaviorSubject<boolean>(false);
  folderId:BehaviorSubject<string>=new BehaviorSubject<string>("");

  // Mock data
  private mockFolders: Folder[] = [
    {
      id: '1',
      name: 'المشاريع',
      createdAt: '2024-01-15',
      type: 'folder'
    },
    {
      id: '2',
      name: 'الوثائق المهمة',
      createdAt: '2024-01-10',
      type: 'folder'
    },
    {
      id: '3',
      name: 'التصاميم',
      parentId: '1',
      createdAt: '2024-01-12',
      type: 'folder'
    }
  ];

  private mockDocuments: Document[] = [
    
  ];

  constructor(private _HttpClient:HttpClient) {
    this.foldersSubject.next(this.mockFolders);
    this.documentsSubject.next(this.mockDocuments);

    this.getAllFolders().subscribe({
      next: (res) => {
        this.folderData.next(res.data);
      },
      error: (err) => {     
        console.error('Error fetching folders:', err);
      } });
  }

  
  

  getAllFolders(): Observable<any> {
    return this._HttpClient.get('folder/all');
  }
  deleteFolder(id:string):Observable<any>
  {
    return this._HttpClient.delete(`folder/delete/${id}`);
  }
  createWorkspaceFolder(data: CreateFolderData,id:string): Observable<any> {

   return this._HttpClient.post(`folder/create?workSpaceId=${id}`,data);
 
  }
  createChildFolder(data: CreateFolderData,id:string): Observable<any> {

   return this._HttpClient.post(`folder/create?folderId=${id}`,data);
 
  }
  updateFolder(id:string,data:UpdateFolderData):Observable<any>
  {
      return this._HttpClient.put(`folder/update/${id}`,data);
  }
  getFolderById(id:string):Observable<any>
  {
    return this._HttpClient.get(`folder/get/${id}`);
  }
  getChildernFolder(id:string):Observable<any>
  {
    return this._HttpClient.get(`folder/getByParent/${id}`)
  }
  getAllFolderWorkspace(id:string):Observable<any>
  {
    return this._HttpClient.get(`folder/allWorkspace/${id}`)
  }
  getAllFolderUser():Observable<any>
  {
    return this._HttpClient.get('folder/allUser');
  }
}
