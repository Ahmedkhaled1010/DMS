import { Component, input } from '@angular/core';
import { User } from '../../Interfaces/User/user';
import { MyTranslateService } from '../../Services/Translate/my-translate.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  user=input<User>();
  constructor(private _MyTranslateService:MyTranslateService)
  {

  }
  changeLanguage()
  {
    this._MyTranslateService.changeLanguage();
  }

}
