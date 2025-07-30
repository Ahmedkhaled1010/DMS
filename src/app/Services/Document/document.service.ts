import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, delay, Observable, of } from 'rxjs';
import { DocumentModel, DocumentTag, Privacy, DocumentFilter, PaginatedResponse } from '../../Interfaces/Document/document';

@Injectable({
  providedIn: 'root',
})
export class DocumentService {
  documentCreated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  constructor(private _HttpClient: HttpClient) {


  }
   private documentsSubject = new BehaviorSubject<DocumentModel[]>([]);
  public documents$ = this.documentsSubject.asObservable();

  // Mock data
 
 
  

  
createDocumentInWorkspaceAndFolder(
    workSpaceId?: string,
    folderId?: string,
    formData?: FormData
  ): Observable<any> {
    return this._HttpClient.post(
      `document/create?workSpaceId=${workSpaceId}&folderId=${folderId}`,
      formData
    );
  }
 
 createDocumentInWorkspace(
    workSpaceId?: string,
    formData?: FormData
  ): Observable<any> {
    return this._HttpClient.post(
      `document/create?workSpaceId=${workSpaceId}`,
      formData
    );
  }
  createDocumentInFolder(
    folderId?: string,
    formData?: FormData
  ): Observable<any> {
    return this._HttpClient.post(
      `document/create?folderId=${folderId}`,
      formData
    );
  }
  getAllDocumentWorkspace(workspaceId: string): Observable<any> {
    return this._HttpClient.get(`document/allworkSpace/${workspaceId}`);
  }
  getAllDocumentFolder(folderId: string): Observable<any> {
    return this._HttpClient.get(`document/allfolder/${folderId}`);
  }
  downloadDocument(id: string): Observable<any> {
    return this._HttpClient.get(`document/download/${id}`, {
      responseType: 'blob',
      observe: 'response',
    });
  }
  reviewDocument(id: string): Observable<any> {
    return this._HttpClient.get(`document/review/${id}`);
  }
  deleteDocument(id:string):Observable<any>
  {
    return this._HttpClient.delete(`document/delete/${id}`)
  }
  getAllDocumentUser(data:DocumentFilter):Observable<any>
  {
      let params =this.changeToformData(data);
      console.log(params);
      

    return this._HttpClient.get(`document/all`,{params});
  }
 changeToformData(data: DocumentFilter): HttpParams {
  let params = new HttpParams();

  if (data.fileName) {
    params = params.set('fileName', data.fileName);
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
  if (data.minSize !== undefined && data.minSize !== null) {
    params = params.set('minSize', data.minSize);
  }
  if (data.maxSize !== undefined && data.maxSize !== null) {
    params = params.set('maxSize', data.maxSize);
  }
  if (data.pageNum !== undefined && data.pageNum !== null) {
    params = params.set('pageNum', data.pageNum);
  }
  if (data.isDeleted !== undefined && data.isDeleted !== null) {
    params = params.set('isDeleted', data.isDeleted);
  }
  if (data.privacy) {
    params = params.set('privacy', data.privacy);
  }
  if (data.tag) {
    params = params.set('tag', data.tag);
  }
  if (data.fileType) {
    params = params.set('fileType', data.fileType);
  }

  return params;
}

getDocumentById(id:string):Observable<any>
{
  return this._HttpClient.get(`document/getdata/${id}`);
}
updateDocument(id:string,formData:Document):Observable<any>
{
  return this._HttpClient.post(`document/updatedata/${id}`,formData);
}
shareDocument(id:string,email:string):Observable<any>
{
  return this._HttpClient.post(`sharedDocument/shared/${id}`, { email: email });
}
getAllDeletedDocuments(): Observable<any> 
{
  return this._HttpClient.get('document/alldeleted');
}
restoreDocument(id:string): Observable<any> 
{
  return this._HttpClient.put(`document/retrive/${id}`,{});
}
deleteMetaData(id: string): Observable<any> {
  return this._HttpClient.delete(`document/deletedata/${id}`);  
}
getAllArchivedDocuments(): Observable<any> {
  return this._HttpClient.get('document/allarchived');
}
getAllSharedWithMeDocuments(): Observable<any> {
  return this._HttpClient.get('sharedDocument/shared');
}
}
