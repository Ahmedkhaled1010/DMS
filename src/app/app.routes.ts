import { Routes } from '@angular/router';
import { HomeComponent } from './Pages/home/home.component';
import { AuthComponent } from './Pages/auth/auth.component';
import { authGuard } from './core/guards/auth.guard';
import { WorkspacepageComponent } from './Pages/workspacepage/workspacepage.component';
import { WorkspaceDataComponent } from './Pages/workspace-data/workspace-data.component';
import { AllDocumentComponent } from './Pages/all-document/all-document.component';
import { DocumentdetailsComponent } from './Pages/documentdetails/documentdetails.component';
import { DeletedDocumentComponent } from './Pages/deleted-document/deleted-document.component';
import { ArchiveDocumentComponent } from './Pages/archive-document/archive-document.component';
import { ShareddocumentComponent } from './Pages/shareddocument/shareddocument.component';
import { FoldermanagerComponent } from './Pages/foldermanager/foldermanager.component';
import { FolderdetailsComponent } from './Pages/foldermanager/folderdetails/folderdetails.component';
import { PublicComponent } from './Pages/public/public.component';
import { ProfilePageComponent } from './Pages/profile-page/profile-page.component';
import { MessagepageComponent } from './Pages/messagepage/messagepage.component';
import { AdminDashboardComponent } from './Pages/admin-dashboard/admin-dashboard.component';
import { adminGuard } from './core/guards/Admin/admin.guard';
import { LandingpageComponent } from './landingpage/landingpage.component';
import { ReviewdocumentComponent } from './reviewdocument/reviewdocument.component';
import { FirstPageComponentComponent } from './first-page-component/first-page-component.component';
import { FirstPageComponent } from './Pages/first-page/first-page.component';
import { UnauthorizedPageComponent } from './Pages/unauthorized-page/unauthorized-page.component';
import { NotFoundPageComponent } from './Pages/not-found-page/not-found-page.component';
import { SharedDocumentViewComponent } from './Pages/shared-document-view/shared-document-view.component';
import { FavoriteDocumentsComponent } from './Pages/favorite-documents/favorite-documents.component';

export const routes: Routes = [
    {path:"",component:LandingpageComponent},
    {path:"login",component:AuthComponent},
    {path:"landing",component:LandingpageComponent},
    {path:"unauthorized",component:UnauthorizedPageComponent},
    {path:"shared/:token",component:SharedDocumentViewComponent},
    {path:"home",canActivate:[authGuard],component:HomeComponent,children:[
        {
            path:"",redirectTo:"dashboard",pathMatch:"full"
        },
        {
            path:"dashboard",component:FirstPageComponent
        },
        {
            path:"workspaces",component:WorkspacepageComponent
        },
         {
            path:"workspace/:id",component:WorkspaceDataComponent
        },
        {
            path:"Documents",component:AllDocumentComponent
        },
         {
            path:"DeletedDocuments",component:DeletedDocumentComponent
        }
        ,
         {
            path:"ArchivedDocuments",component:ArchiveDocumentComponent
        },
         {
            path:"SharedDocuments",component:ShareddocumentComponent
        },
        {
            path:"Folders",component:FoldermanagerComponent
        },
         {
            path:"Documentdetails/:id",component:DocumentdetailsComponent
        },
        {path:"folderDetails/:id",component:FolderdetailsComponent},
        {
            path:"public",component:PublicComponent
        },
        {
            path:"profile",component:ProfilePageComponent
        },
        {
            path:"message",component:MessagepageComponent
        }
        ,
        {
            path:"message/:id/:name",component:MessagepageComponent
        },
        {
            path:"reviewdocument/:data",component:ReviewdocumentComponent
        },
        {
            path:"favorites",component:FavoriteDocumentsComponent
        }


    ]},
     {
            path:"admin",canActivate:[adminGuard], component:AdminDashboardComponent
        },

        // Wildcard route - must be last
        {
            path:"**", component:NotFoundPageComponent
        }
];
