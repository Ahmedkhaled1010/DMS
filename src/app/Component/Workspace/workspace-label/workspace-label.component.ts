import { Component, input } from '@angular/core';
import { Workspace } from '../../../Interfaces/Workspace/workspace';
import { CreateworkspaceComponent } from "../createworkspace/createworkspace.component";
import { WorkspaceService } from '../../../Services/Workspace/workspace.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-workspace-label',
  standalone: true,
  imports: [CreateworkspaceComponent],
  templateUrl: './workspace-label.component.html',
  styleUrl: './workspace-label.component.scss'
})
export class WorkspaceLabelComponent {
  workspace=input<Workspace>();
  //create=input<boolean>();
  show:boolean=false;
  update:boolean=false;
  constructor(private _WorkspaceService:WorkspaceService,private _ToastrService:ToastrService){

  }
  ngOnInit(): void {
    
    this._WorkspaceService.isCreate.subscribe(
      (res)=>{
        this.show=this._WorkspaceService.isCreate.getValue();
        
      }
    )
  }
  updateWorkspace()
  {
    this._WorkspaceService.isUpdated.next(true);
    this._WorkspaceService.isCreate.next(true);
  }
  deleteWorkspace()
  {
    this._WorkspaceService.deleteWorkspace(this.workspace()?.id!).subscribe(
      {
        next:(res)=>{
          console.log(res);
          this._ToastrService.success(`${this.workspace()?.name}  Workspace is Deleted` );
          this._WorkspaceService.isDeleted.next(true);
        },
        error:(err)=>{
          console.log(err);
          
        }

      }
    )
  }
}
