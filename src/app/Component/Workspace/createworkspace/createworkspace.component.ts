import { Component, Inject, input, output, PLATFORM_ID } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { WorkspaceService } from '../../../Services/Workspace/workspace.service';
import { Workspace } from '../../../Interfaces/Workspace/workspace';
import { TranslateModule } from '@ngx-translate/core';
import { isPlatformBrowser } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-createworkspace',
  standalone: true,
  imports: [FormsModule, TranslateModule, ReactiveFormsModule],
  templateUrl: './createworkspace.component.html',
  styleUrl: './createworkspace.component.scss',
})
export class CreateworkspaceComponent {
  workspace = input<Workspace>();
  workspacename: string = '';
  workspacedescription: string = '';
  isUpdate: boolean = false;
  show:boolean=false;
  constructor(
    private _WorkspaceService: WorkspaceService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private _ToastrService: ToastrService
  ) {}
  async ngOnInit(): Promise<void> {
    
    this._WorkspaceService.isUpdated.subscribe((res) => {
      this.isUpdate = this._WorkspaceService.isUpdated.getValue();
    });
     this._WorkspaceService.isCreate.subscribe((res) => {
      this.show = this._WorkspaceService.isCreate.getValue();
    });
    if (isPlatformBrowser(this.platformId)) {
      const WOW = (await import('wowjs')).default;

      new WOW().init();
    }

    const id = this.workspace()?.id ? this.workspace()?.id : '';
    this.getWorkspaceById(id);
  }
  workspaceForm: FormGroup = new FormGroup({
    name: new FormControl(null, [Validators.required]),
    description: new FormControl(null, [Validators.required]),
  });
  updateWorkspaceForm: FormGroup = new FormGroup({
    name: new FormControl(null),
    description: new FormControl(null),
  });

  create() {
    if (this.workspaceForm.invalid) {
      this.workspaceForm.markAllAsTouched();

      const controls = this.workspaceForm.controls;

      if (controls['name'].invalid) {
        this._ToastrService.error('name must not be blank');
        return;
      }

      if (controls['description'].invalid) {
        this._ToastrService.error('description must not be blank');
        return;
      }
    }

    this._WorkspaceService.createWorkspace(this.workspaceForm.value).subscribe({
      next: (res) => {
        console.log(res);
        this._WorkspaceService.isCreate.next(false);
        this._ToastrService.success(res.statusMsg);
      },
      error: (err) => {
        console.log(err);
      }, complete:()=>{
            this.restform();
          }
    });
  }
  update() {
    if (
      this.updateWorkspaceForm.get('name') == null &&
      this.updateWorkspaceForm.get('description') == null
    ) {
      this._ToastrService.error('no updated data');
      this._WorkspaceService.isCreate.next(false);
      this._WorkspaceService.isUpdated.next(false);
    } 

    else {
        if (this.updateWorkspaceForm.get('name') == null) {
          this.updateWorkspaceForm.get('name')?.setValue(null);
        }
         if (this.updateWorkspaceForm.get('description') == null) {
          this.updateWorkspaceForm.get('description')?.setValue(null);
        }
        console.log(this.updateWorkspaceForm.value);
        
      this._WorkspaceService
        .updateWorkSpace(this.updateWorkspaceForm.value, this.workspace()?.id!)
        .subscribe({
          next: (res) => {
            console.log(res);
            this._WorkspaceService.isCreate.next(false);
            this._WorkspaceService.isUpdated.next(false);
            this._ToastrService.success(res.statusMsg);

          },
          error: (err) => {
            console.log(err);

            this._ToastrService.error(err.statusMsg);
          },
          complete:()=>{
            this.restform();
          }
        });
    }
  }
  getWorkspaceById(id: string | undefined) {
    console.log(id);

    this._WorkspaceService.getWorkspaceById(id).subscribe({
      next: (res) => {
        console.log(res);
        this.workspacename = res.data.name;
        this.workspacedescription = res.data.description;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  closeModal() {
    this._WorkspaceService.isUpdated.next(false);

    this._WorkspaceService.isCreate.next(false);
  }
  restform()
  {
    this.workspaceForm.reset();
    this.updateWorkspaceForm.reset();
  }
}
