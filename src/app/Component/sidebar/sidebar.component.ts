import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { AuthService } from '../../Services/Auth/auth.service';
import { RouterLink } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  constructor(private _AuthService:AuthService, @Inject(PLATFORM_ID) private platformId: Object){}


  logOut()
  {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem("Token");
    }
    this._AuthService.saveUserData();
  }
}
