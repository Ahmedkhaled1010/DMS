import { Routes } from '@angular/router';
import { HomeComponent } from './Pages/home/home.component';
import { AuthComponent } from './Pages/auth/auth.component';
import { authGuard } from './core/guards/auth.guard';
import { WorkspacepageComponent } from './Pages/workspacepage/workspacepage.component';
import { WorkspaceDataComponent } from './Pages/workspace-data/workspace-data.component';
import { AllDocumentComponent } from './Pages/all-document/all-document.component';
import { DocumentdetailsComponent } from './Pages/documentdetails/documentdetails.component';
import { DeletedDocumentComponent } from './Pages/deleted-document/deleted-document.component';
import { arch } from 'os';
import { ArchiveDocumentComponent } from './Pages/archive-document/archive-document.component';
import { ShareddocumentComponent } from './Pages/shareddocument/shareddocument.component';
import { FoldermanagerComponent } from './Pages/foldermanager/foldermanager.component';

export const routes: Routes = [
     {path:"",redirectTo:"login",pathMatch:"full"},
    {path:"login",component:AuthComponent},
    {path:"home",canActivate:[authGuard],component:HomeComponent,children:[
        {
            path:"",redirectTo:"workspaces",pathMatch:"full"
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
        }
       
    ]},
    

];
