import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { WorkspaceService } from '../../Services/Workspace/workspace.service';
import { AuthService } from '../../Services/Auth/auth.service';
import { DocumentService } from '../../Services/Document/document.service';
import { FolderService } from '../../Services/Folder/folder.service';
import { DocumentFilter, DocumentModel, Privacy } from '../../Interfaces/Document/document';
import { updateUser, User } from '../../Interfaces/User/user';
import { MessageService } from 'primeng/api';
import { ToastrService } from 'ngx-toastr';


interface UserData {
  name: string;
  userName: string;
  mobileNumber: string;
  nationalID: string;
  email: string;
  profileImage: string;
  totalWorkspaces: number;
  totalDocuments: number;
  totalFolders: number;
  totalDeletedDocs: number;
  archivedDocs: number;
  totalPublicDocs: number;
}
@Component({
  selector: 'app-profile-page',
  standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
  providers:[MessageService],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.scss'
})
export class ProfilePageComponent {
 userData: UserData = {
    name: 'John Doe',
    userName: 'johndoe123',
    mobileNumber: '+1234567890',
    nationalID: 'ID123456789',
    email: 'john.doe@example.com',
    profileImage: '/placeholder.svg?height=120&width=120',
    totalWorkspaces: 5,
    totalDocuments: 142,
    totalFolders: 28,
    totalDeletedDocs: 15,
    archivedDocs: 23,
    totalPublicDocs: 67
  };
  user?:User
  selectedPrivacy: Privacy  = Privacy.PUBLIC;

  passwordForm: FormGroup;
  showEditModal = false;
  showPasswordModal = false;
  isDarkMode = false;
  selectedFile: File | null = null;
  alertMessage = '';
  alertType = '';
  allWorkspace:number=0
  totalFodler:number=0
  PublicDocuments:number=0
  ArchivedDocuments:number=0
  DeletedDocuments:number=0
  TotalDocuments:number=0
  documents:DocumentModel[]=[]
  profileImage:string=""
  editProfile:boolean=false
  formData?:FormData
  editForm: FormGroup =new FormGroup(
    {
      name:new FormControl('',[ Validators.minLength(3)]),
      userName:new FormControl('',[ Validators.minLength(3)]),
      mobileNumber:new FormControl('',[ Validators.pattern(/^01[0-9]{9}$/)]),
      email:new FormControl('',[ Validators.email]),


    }
  );
  constructor(private fb: FormBuilder,
    private _WorkspaceService:WorkspaceService,
    private _FolderService:FolderService,
    private _DocumentService:DocumentService,
    private _AuthService:AuthService,
    private _MessageService:MessageService,
    private _ToastrService:ToastrService
    

  ) {
   

    this.passwordForm = new FormGroup({
      oldPassword:new FormControl ('', [Validators.required]),
      newPassword:new FormControl ('', [Validators.required, Validators.minLength(5)]),
   
    });
  }

  ngOnInit() {
    this._AuthService.userPic.subscribe((res)=>{
      this.profileImage=this._AuthService.userPic.getValue()
    })
    this._AuthService.User.subscribe((res)=>{
       this.user=res
       
    })
    // Check for saved theme preference
   this.initialData();
  
  }
  initialData()
  {
   
    this.getProfileImage()
    this.getAllWorkspace()
    this.getAllFolder()
    this.getAllDocument()
  }
  passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword');
    const confirmPassword = form.get('confirmPassword');
    
    if (newPassword && confirmPassword && newPassword.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    return null;
  }

  

  openEditModal(show:boolean) {
    if (show) {
      this.editProfile=false
    }
    else
    {
      this.editProfile=true 
    }
    this.editForm.patchValue({
      name: this.user?.name,
      mobileNumber: this.user?.mobileNumber,
      email: this.user?.email,
      userName:this.user?.userName
      
    });
    this.showEditModal = true;
  }

  closeEditModal() {
    this.showEditModal = false;
    this.selectedFile = null;
    this.clearAlert();
  }

  openPasswordModal() {
    this.passwordForm.reset();
    this.showPasswordModal = true;
  }

  closePasswordModal() {
    this.showPasswordModal = false;
    this.clearAlert();
  }

  onFileSelected(event: any) {
    this.formData=new FormData()
        const file = event.target.files[0];

      this.formData.append('file', file);
    
  
  }
 getProfileImage()
 {
    this._AuthService.getProfileImage().subscribe(
      {
        next:(res)=>{
          console.log(res);
          this.profileImage=res.data
          this._AuthService.userPic.next(res.data)
          
        },
        error:(err)=>{
          console.log(err);
          
        }
      }
    )
 }
  saveProfile() {
   
    if (this.formData!=null) {
      this._AuthService.uploadProfilePic( this.formData).subscribe(
      {
        next:(res)=>{
          console.log(res);
                    this.getProfileImage()

        },
        error:(err)=>{
          console.log(err);
        }
      }
    )    
     setTimeout(() => {
        this.closeEditModal();
      }, 1500);
    }
    else {
      const updateUser:updateUser={
         name:this.editForm.value.name,
  userName:this.editForm.value.userName,
  mobileNumber:this.editForm.value.mobileNumber,
  email:this.editForm.value.email
      }
    

      // Here you would typically make an API call to save the data
      console.log('Saving profile:', updateUser);
      this._AuthService.updateUser(updateUser).subscribe(
        {
          next:(res:any)=>{
            console.log(res);
           // this.user=res;
           this._AuthService.User.next(res)
            
          },
          error:(err)=>{
            console.log(err);
            
          }
        }
      )
      
      this.showAlert('Profile updated successfully!', 'success');
      setTimeout(() => {
        this.closeEditModal();
      }, 1500);
    } 
  }

  changePassword() {
    if (this.passwordForm.valid) {

      this._AuthService.changePassword(this.passwordForm.value).subscribe(
        {
          next:(res)=>{
            console.log(res);
                  this.showAlert('Password changed successfully!', 'success');

          },
          error:(err)=>{
            console.log(err.error.statusMsg);
                    this._ToastrService.error(err.error.statusMsg,'Change Password');

            
          }
        }
      )
      // Here you would typically make an API call to change the password
      console.log('Changing password...');
      
      setTimeout(() => {
        this.closePasswordModal();
      }, 1500);
    } else {
      this.showAlert('Please fill in all fields correctly', 'error');
    }
  }

  showAlert(message: string, type: string) {
    this.alertMessage = message;
    this.alertType = type;
    
    setTimeout(() => {
      this.clearAlert();
    }, 5000);
  }

  clearAlert() {
    this.alertMessage = '';
    this.alertType = '';
  }

  getFieldError(fieldName: string, formGroup: FormGroup = this.editForm): string {
    const field = formGroup.get(fieldName);
    if (field && field.errors && field.touched) {
      if (field.errors['required']) return `${fieldName} is required`;
      if (field.errors['email']) return 'Please enter a valid email';
      if (field.errors['minlength']) return `${fieldName} is too short`;
      if (field.errors['pattern']) return 'Please enter a valid phone number';
      if (field.errors['passwordMismatch']) return 'Passwords do not match';
    }
    return '';
  }
  getAllWorkspace()
  {
      this._WorkspaceService.getAllWorkspace().subscribe({
        next:(res)=>{
          console.log(res);
          this.allWorkspace=res.data.length;
          
        }
      })
  }
  getAllFolder()
  {
    this._FolderService.getAllFolders().subscribe({
      next:(res)=>{
        console.log(res);
        this.totalFodler=res.data.length;
        
      }
    })
  }
  getAllDocument()
  {
    let data:any[]
    let Privacy="PUBLIC"
     const filter: DocumentFilter = {
         
        
        };
    this._DocumentService.getAllDocumentUser(filter).subscribe({
      next:(res)=>{
        console.log(res);
        this.documents=res.data
        this.TotalDocuments=this.documents.length;

      }
    })
const filter1: DocumentFilter = {
         
        privacy:this.selectedPrivacy|| undefined,
        };
this._DocumentService.getAllDocumentUser(filter1).subscribe({
      next:(res)=>{
        console.log(res);
        this.documents=res.data
        this.PublicDocuments=this.documents.length;

      }
    })
    this._DocumentService.getAllDeletedDocuments().subscribe({
      next:(res)=>{
        this.DeletedDocuments=res.data.length
      }
    })
    this._DocumentService.getAllArchivedDocuments().subscribe({
      next:(res)=>{
        this.ArchivedDocuments=res.data.length
      }
    })

  }
  getUserDetails()
  {

  }

}
