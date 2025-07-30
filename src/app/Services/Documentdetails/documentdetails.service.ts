import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { DocumentActivity, DocumentDetailDto, DocumentTag, Privacy, ShareDocumentRequest, SharedUser, SharePermission, UpdateDocumentRequest } from '../../Interfaces/Document/document';
@Injectable({
  providedIn: 'root'
})
export class DocumentdetailsService {

  private mockDocument: DocumentDetailDto = {
    id: '1',
    workspaceId: 'ws1',
    folderId: 'folder1',
    fileName: 'تقرير_المشروع_الأول.pdf',
    fileType: 'pdf',
    filePath: '/documents/report1.pdf',
    nationalID: '12345678901',
    size: 2048576,
    title: 'تقرير المشروع الأول - الربع الأول 2024',
    isDeleted: false,
    createdAt: '2024-01-15T10:30:00Z',
    workspaceName: 'مساحة العمل الأولى',
    folderName: 'تقارير المشاريع',
    createdBy: 'أحمد محمد',
    updatedAt: '2024-01-20T14:15:00Z',
    updatedBy: 'سارة أحمد',
    tag: DocumentTag.IMPORTANT,
    privacy: Privacy.PRIVATE,
    version: 2
  };

  private mockSharedUsers: SharedUser[] = [
    {
      id: 'user1',
      email: 'sara@example.com',
      name: 'سارة أحمد',
      permissions: [SharePermission.VIEW, SharePermission.DOWNLOAD],
      sharedAt: '2024-01-16T09:00:00Z',
      status: 'ACTIVE'
    },
    {
      id: 'user2',
      email: 'mohamed@example.com',
      name: 'محمد علي',
      permissions: [SharePermission.VIEW, SharePermission.EDIT],
      sharedAt: '2024-01-17T11:30:00Z',
      expiryDate: '2024-02-17T11:30:00Z',
      status: 'ACTIVE'
    }
  ];

  private mockActivities: DocumentActivity[] = [
    {
      id: 'activity1',
      action: 'UPDATE',
      description: 'تم تحديث عنوان المستند',
      performedBy: 'سارة أحمد',
      performedAt: '2024-01-20T14:15:00Z',
      details: { field: 'title', oldValue: 'تقرير المشروع', newValue: 'تقرير المشروع الأول - الربع الأول 2024' }
    },
    {
      id: 'activity2',
      action: 'SHARE',
      description: 'تم مشاركة المستند مع محمد علي',
      performedBy: 'أحمد محمد',
      performedAt: '2024-01-17T11:30:00Z',
      details: { sharedWith: 'mohamed@example.com', permissions: ['VIEW', 'EDIT'] }
    },
    {
      id: 'activity3',
      action: 'SHARE',
      description: 'تم مشاركة المستند مع سارة أحمد',
      performedBy: 'أحمد محمد',
      performedAt: '2024-01-16T09:00:00Z',
      details: { sharedWith: 'sara@example.com', permissions: ['VIEW', 'DOWNLOAD'] }
    },
    {
      id: 'activity4',
      action: 'CREATE',
      description: 'تم إنشاء المستند',
      performedBy: 'أحمد محمد',
      performedAt: '2024-01-15T10:30:00Z',
      details: { fileName: 'تقرير_المشروع_الأول.pdf', size: 2048576 }
    }
  ];

  private mockFolders = [
    { id: 'folder1', name: 'تقارير المشاريع' },
    { id: 'folder2', name: 'الوثائق المهمة' },
    { id: 'folder3', name: 'المسودات' },
    { id: 'folder4', name: 'الأرشيف' }
  ];

  constructor() {}

  getDocumentById(id: string): Observable<{ data: DocumentDetailDto; message: string; success: boolean }> {
    return of({
      data: this.mockDocument,
      message: 'تم جلب تفاصيل المستند بنجاح',
      success: true
    }).pipe(delay(800));
  }

  updateDocument(id: string, request: UpdateDocumentRequest): Observable<{ data: DocumentDetailDto; message: string; success: boolean }> {
    // Update mock data
    if (request.fileName) this.mockDocument.fileName = request.fileName;
    if (request.title) this.mockDocument.title = request.title;
    if (request.tag) this.mockDocument.tag = request.tag;
    if (request.privacy) this.mockDocument.privacy = request.privacy;
    if (request.folderId !== undefined) this.mockDocument.folderId = request.folderId;
    
    this.mockDocument.updatedAt = new Date().toISOString();
    this.mockDocument.updatedBy = 'المستخدم الحالي';
    this.mockDocument.version += 1;

    // Add activity
    this.mockActivities.unshift({
      id: 'activity_' + Date.now(),
      action: 'UPDATE',
      description: 'تم تحديث بيانات المستند',
      performedBy: 'المستخدم الحالي',
      performedAt: new Date().toISOString(),
      details: request
    });

    return of({
      data: this.mockDocument,
      message: 'تم تحديث المستند بنجاح',
      success: true
    }).pipe(delay(1500));
  }

  shareDocument(request: ShareDocumentRequest): Observable<{ data: any; message: string; success: boolean }> {
    // Add new shared user
    const newSharedUser: SharedUser = {
      id: 'user_' + Date.now(),
      email: request.userEmail,
      name: request.userEmail.split('@')[0], // Simple name extraction
      permissions: request.permissions,
      sharedAt: new Date().toISOString(),
      expiryDate: request.expiryDate,
      status: 'ACTIVE'
    };

    this.mockSharedUsers.push(newSharedUser);

    // Add activity
    this.mockActivities.unshift({
      id: 'activity_' + Date.now(),
      action: 'SHARE',
      description: `تم مشاركة المستند مع ${request.userEmail}`,
      performedBy: 'المستخدم الحالي',
      performedAt: new Date().toISOString(),
      details: { 
        sharedWith: request.userEmail, 
        permissions: request.permissions,
        message: request.message 
      }
    });

    return of({
      data: newSharedUser,
      message: 'تم مشاركة المستند بنجاح',
      success: true
    }).pipe(delay(1200));
  }

  getSharedUsers(documentId: string): Observable<{ data: SharedUser[]; message: string; success: boolean }> {
    return of({
      data: this.mockSharedUsers,
      message: 'تم جلب قائمة المستخدمين المشاركين بنجاح',
      success: true
    }).pipe(delay(600));
  }

  revokeAccess(documentId: string, userId: string): Observable<{ data: any; message: string; success: boolean }> {
    const userIndex = this.mockSharedUsers.findIndex(user => user.id === userId);
    if (userIndex !== -1) {
      const user = this.mockSharedUsers[userIndex];
      this.mockSharedUsers.splice(userIndex, 1);

      // Add activity
      this.mockActivities.unshift({
        id: 'activity_' + Date.now(),
        action: 'REVOKE_ACCESS',
        description: `تم إلغاء مشاركة المستند مع ${user.name}`,
        performedBy: 'المستخدم الحالي',
        performedAt: new Date().toISOString(),
        details: { revokedFrom: user.email }
      });
    }

    return of({
      data: null,
      message: 'تم إلغاء المشاركة بنجاح',
      success: true
    }).pipe(delay(800));
  }

  getDocumentActivities(documentId: string): Observable<{ data: DocumentActivity[]; message: string; success: boolean }> {
    return of({
      data: this.mockActivities,
      message: 'تم جلب سجل النشاطات بنجاح',
      success: true
    }).pipe(delay(700));
  }

  getFolders(): Observable<{ data: { id: string; name: string }[]; message: string; success: boolean }> {
    return of({
      data: this.mockFolders,
      message: 'تم جلب قائمة المجلدات بنجاح',
      success: true
    }).pipe(delay(500));
  }

  deleteDocument(id: string): Observable<{ data: any; message: string; success: boolean }> {
    this.mockDocument.isDeleted = true;
    this.mockDocument.updatedAt = new Date().toISOString();
    this.mockDocument.updatedBy = 'المستخدم الحالي';

    // Add activity
    this.mockActivities.unshift({
      id: 'activity_' + Date.now(),
      action: 'DELETE',
      description: 'تم حذف المستند',
      performedBy: 'المستخدم الحالي',
      performedAt: new Date().toISOString(),
      details: {}
    });

    return of({
      data: null,
      message: 'تم حذف المستند بنجاح',
      success: true
    }).pipe(delay(1000));
  }

  restoreDocument(id: string): Observable<{ data: any; message: string; success: boolean }> {
    this.mockDocument.isDeleted = false;
    this.mockDocument.updatedAt = new Date().toISOString();
    this.mockDocument.updatedBy = 'المستخدم الحالي';

    // Add activity
    this.mockActivities.unshift({
      id: 'activity_' + Date.now(),
      action: 'RESTORE',
      description: 'تم استعادة المستند',
      performedBy: 'المستخدم الحالي',
      performedAt: new Date().toISOString(),
      details: {}
    });

    return of({
      data: null,
      message: 'تم استعادة المستند بنجاح',
      success: true
    }).pipe(delay(1000));
  }

  downloadDocument(id: string): Observable<{ data: string; message: string; success: boolean }> {
    return of({
      data: this.mockDocument.filePath,
      message: 'تم تحضير الملف للتحميل',
      success: true
    }).pipe(delay(500));
  }
}
