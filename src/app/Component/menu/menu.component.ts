import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { WorkspaceService } from '../../Services/Workspace/workspace.service';
import { Workspace } from '../../Interfaces/Workspace/workspace';
import { WorkspaceLabelComponent } from "../Workspace/workspace-label/workspace-label.component";
import { WorkspacesComponent } from "../Workspace/workspaces/workspaces.component";
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [TranslateModule ,RouterLink],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {
  
}
