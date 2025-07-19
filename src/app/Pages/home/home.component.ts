import { Component } from '@angular/core';
import { AuthService } from '../../Services/Auth/auth.service';
import { User } from '../../Interfaces/user';
import { TranslateService } from '@ngx-translate/core';
import { SidebarComponent } from "../../Component/sidebar/sidebar.component";
import { NavbarComponent } from "../../Component/navbar/navbar.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SidebarComponent, NavbarComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  user?:User;
  constructor(private _AuthService:AuthService,private _TranslateService:TranslateService){}
  ngOnInit(): void {
    
    this._AuthService.getMe().subscribe(
      {
        next:(res)=>{
          console.log(res);
          this.user=res.data;
          
        },
        error:(err)=>
        {
          console.log(err);
          
        }
      }
    )
    
    
  }

}
