import { Component } from '@angular/core';
import { AuthService } from '../../Services/Auth/auth.service';
import { User } from '../../Interfaces/User/user';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SidebarComponent } from "../../Component/sidebar/sidebar.component";
import { NavbarComponent } from "../../Component/navbar/navbar.component";
import { MenuComponent } from "../../Component/menu/menu.component";
import { RouterModule } from '@angular/router'; // ✅ 

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SidebarComponent, NavbarComponent, TranslateModule, MenuComponent, RouterModule],
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
          console.log(this.user);
          
          this._AuthService.User.next(this.user);
          
        },
        error:(err)=>
        {
          console.log(err);
          
        }
      }
    )
    
    this._AuthService.User.subscribe(
      (res)=>{
        this.user=res
      }
    )
  }

}
