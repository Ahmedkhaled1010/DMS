import { Component, Output, EventEmitter, input } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { Workspace } from '../../../Interfaces/Workspace/workspace';
import { TranslateModule } from '@ngx-translate/core';
import { WorkspaceService } from '../../../Services/Workspace/workspace.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-workspacemodel',
  standalone: true,
  imports: [TranslateModule,RouterLink],
  templateUrl: './workspacemodel.component.html',
  styleUrl: './workspacemodel.component.scss',
  animations: [
    trigger('slideIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ opacity: 0, transform: 'translateY(-20px)' }))
      ])
    ]),
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('200ms ease-in', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('200ms ease-out', style({ opacity: 0 }))
      ])
    ]),
    trigger('slideInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.95)' }),
        animate('200ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
      ])
    ])
  ]
})
export class WorkspacemodelComponent {

 //@Input() workspace!: Workspace;
 workspace=input<Workspace>();
  @Output() edit = new EventEmitter<Workspace>();
  @Output() delete = new EventEmitter<string>();

  showDeleteDialog = false;
  isDeleting = false;
constructor(private _WorkspaceService:WorkspaceService){

}
  editWorkspace(): void {
    this.edit.emit(this.workspace());
  }

  confirmDelete(): void {
    this.isDeleting = true;
    this.delete.emit(this.workspace()?.id);
    this._WorkspaceService.isDeleted.next(true);
    // Simulate API delay
    setTimeout(() => {
      this.isDeleting = false;
      this.showDeleteDialog = false;
    }, 1000);
  }
}



