import { Workspace } from './../../Interfaces/Workspace/workspace';

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkspacemodelComponent } from "../../Component/Workspace/workspacemodel/workspacemodel.component";
import { WorkspaceService } from '../../Services/Workspace/workspace.service';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { CreateworkspaceComponent } from "../../Component/Workspace/createworkspace/createworkspace.component";

@Component({
  selector: 'app-workspacepage',
  standalone: true,
  imports: [CommonModule, WorkspacemodelComponent, TranslateModule, CreateworkspaceComponent],
  templateUrl: './workspacepage.component.html',
  styleUrl: './workspacepage.component.scss',
   
})
export class WorkspacepageComponent {
 allWorkspace: Workspace[] = [];
 showCreateModal = false;
  showModal = false;
  selectedWorkspace?: Workspace;
  loading = false;
  error: string | null = null;
  
  private destroy$ = new Subject<void>();

  constructor(
    private workspaceService: WorkspaceService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.workspaceService.isCreate.subscribe((res)=>{
      this.getAllWorkspace();
    })
    this.getAllWorkspace();
    
    // Subscribe to modal state changes
   /* this.workspaceService.isCreate
      .pipe(takeUntil(this.destroy$))
      .subscribe((isOpen) => {
        this.showModal = isOpen;
        if (!isOpen) {
          this.selectedWorkspace = undefined;
          this.getAllWorkspace(); // Refresh list when modal closes
        }
      });*/
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  

  getAllWorkspace(): void {
    this.loading = true;
    this.error = null;
    
   this.workspaceService.getAllWorkspace().subscribe(
    {
      next:(res)=>{
        this.allWorkspace=res.data;
        this.loading=false;
        
      },
      error:(err)=>{
        console.log(err);
        
      }
    }
   )
  }

  createNew(): void {
    console.log(89);
    this.showModal = true;
    //this.selectedWorkspace = undefined;
    this.workspaceService.isUpdated.next(false);
    this.workspaceService.isCreate.next(true);
  }

  editWorkspace(workspace: Workspace): void {
    this.selectedWorkspace = workspace;
    this.workspaceService.isUpdated.next(true);
    this.workspaceService.isCreate.next(true);
  }

  deleteWorkspace(id: string): void {
    const workspace = this.allWorkspace.find(w => w.id === id);
    this.workspaceService.deleteWorkspace(id).subscribe(
      {
        next:(res)=>{
          console.log(res);
          this.getAllWorkspace();
          this.workspaceService.isDeleted.next(true);
        },
        error:(err)=>{
          console.log(err);
          
        }
      }
    )
   /* this.workspaceService.deleteWorkspace(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.toastr.success(`${workspace?.name} workspace deleted successfully`);
          this.getAllWorkspace();
        },
        error: (err) => {
          this.toastr.error('Failed to delete workspace');
          console.error(err);
        }
      });*/
  }

  closeModal(): void {
    this.showModal = false;
    this.showCreateModal = false;
    this.selectedWorkspace = undefined;
  }

  trackByWorkspaceId(index: number, workspace: Workspace): string {
    return workspace.id;
  }
}
