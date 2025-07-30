import { Component } from '@angular/core';
import { AuthService } from '../../Services/Auth/auth.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  constructor(private _AuthService:AuthService){}


  logOut()
  {
    localStorage.removeItem("Token");
    this._AuthService.saveUserData();
  }
}
