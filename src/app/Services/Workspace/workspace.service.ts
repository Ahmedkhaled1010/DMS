import { Workspace, WorkspaceData } from './../../Interfaces/Workspace/workspace';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WorkspaceService {
  isCreate: BehaviorSubject<boolean> = new BehaviorSubject(false);
  isUpdated: BehaviorSubject<boolean> = new BehaviorSubject(false);
  isDeleted: BehaviorSubject<boolean> = new BehaviorSubject(false);
  Workspaces: BehaviorSubject<WorkspaceData[]> = new BehaviorSubject<WorkspaceData[]>([]);
  constructor(private _HttpClient: HttpClient) {

    this.getWorkspaces().subscribe({
      next: (res) => {
        this.Workspaces.next(res.data);
      },
      error: (err) => {
        console.error('Error fetching workspaces:', err);
      } });
  }

  getWorkspaces(): Observable<any> {
    return this._HttpClient.get('workspace/all');
  }
  getAllWorkspace(): Observable<any> {
    return this._HttpClient.get('workspace/getAll');
  }
  createWorkspace(date: Workspace): Observable<any> {
    return this._HttpClient.post('workspace/create', date);
  }
  getWorkspaceById(id: string | undefined): Observable<any> {
    return this._HttpClient.get(`workspace/get/${id}`);
  }
  updateWorkSpace(data: Workspace, id: string): Observable<any> {
    return this._HttpClient.put(`workspace/update/${id}`, data);
  }
  deleteWorkspace(id: string): Observable<any> {
    return this._HttpClient.delete(`workspace/${id}`);
  }
  getAllFolderInWorkspace(id:string)
  {
    
    return this._HttpClient.get(`folder/allWorkspace/${id}`)
  }
}
