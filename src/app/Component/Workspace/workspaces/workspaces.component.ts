import { Component } from '@angular/core';
import { WorkspaceService } from '../../../Services/Workspace/workspace.service';
import { Workspace } from '../../../Interfaces/Workspace/workspace';
import { WorkspaceLabelComponent } from "../workspace-label/workspace-label.component";
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-workspaces',
  standalone: true,
  imports: [WorkspaceLabelComponent,TranslateModule],
  templateUrl: './workspaces.component.html',
  styleUrl: './workspaces.component.scss'
})
export class WorkspacesComponent {
allWorkspace:Workspace[]=[];
create:boolean=false;
  constructor(private _WorkspaceService:WorkspaceService)
  {
    this.getAllWorkspace();
    this._WorkspaceService.isCreate.subscribe((res)=>{this.getAllWorkspace()});
    this._WorkspaceService.isDeleted.subscribe((res)=>{this.getAllWorkspace()});
    this._WorkspaceService.isUpdated.subscribe((res)=>{this.getAllWorkspace()});
  }


  getAllWorkspace()
  {
    this._WorkspaceService.getAllWorkspace().subscribe(
      {
        next:(res)=>{
          console.log(res);
          this.allWorkspace=res.data;
          this.allWorkspace=this.allWorkspace.slice(0,5);
          console.log(this.allWorkspace);
          
          
        },
        error:(err)=>
        {
          console.log(err);
          
        }
      }
    )
  }
  createNew()
  {
       this._WorkspaceService.isCreate.next(true);

  }
  changeWorkspace(create:boolean)
  {
  }
}
