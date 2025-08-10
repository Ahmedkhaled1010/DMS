import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Folder, ApiResponse, CreateFolderData, CreateDocumentData, Document, UpdateFolderData, FolderData, FolderCriteria } from '../../Interfaces/Folder/folder';
import { HttpClient, HttpParams } from '@angular/common/http';

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
 
  constructor(private _HttpClient:HttpClient) {
    

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
   createFolderInParent(data: CreateFolderData,id:string): Observable<any> {

   return this._HttpClient.post(`folder/create?folderId=${id}`,data);
 
  }
   createFolder(data: CreateFolderData,folderId:string,workspaceId:string): Observable<any> {

   return this._HttpClient.post(`folder/create?workSpaceId=${workspaceId}&folderId=${folderId}`,data);
 
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
  getAllFolderUser(data:FolderCriteria):Observable<any>
  {
    let params =this.changeToformData(data);
    return this._HttpClient.get('folder/allUser',{params:params});
  }
  changeToformData(data: FolderCriteria): HttpParams {
    let params = new HttpParams();
  
    if (data.name) {
      params = params.set('name', data.name);
    }
    if (data.sortDirection) {
      params = params.set('sortDirection', data.sortDirection);
    }
    if (data.sortField) {
      params = params.set('sortField', data.sortField);
    }
    if (data.pageSize !== undefined && data.pageSize !== null) {
      params = params.set('pageSize', data.pageSize);
    }
   
    if (data.pageNum !== undefined && data.pageNum !== null) {
      params = params.set('pageNum', data.pageNum);
    }
    if (data.description) {
      params = params.set('description', data.description);
    }
    if (data.userNationalID) {
      params = params.set('userNationalID', data.userNationalID);
    }
    if (data.workspaceId) {
      params = params.set('workspaceId', data.workspaceId);
    }
    if (data.isDeleted !== undefined && data.isDeleted !== null) {
      params = params.set('isDeleted', data.isDeleted.toString());
    }
    
  
    return params;
  }
}
