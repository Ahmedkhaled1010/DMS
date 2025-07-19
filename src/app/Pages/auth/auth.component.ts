import { Component, signal } from '@angular/core';
import { LoginComponent } from "../../Component/login/login.component";
import { RegisterComponent } from "../../Component/register/register.component";
import { MyTranslateService } from '../../Services/Translate/my-translate.service';

declare let $: any;

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [LoginComponent, RegisterComponent],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss'
})
export class AuthComponent {
 

  check=signal<boolean>(false);
  constructor(private _MyTranslateService:MyTranslateService)
  {

  }

ngOnInit(): void {
  
  
}

 


  CheckShow(show:boolean)
  {
    console.log(show);
   if (show) {
  $('#login').fadeOut(200, function () {
    $('#register').fadeIn(200);
  });
} else {
  $('#register').fadeOut(200, function () {
    $('#login').fadeIn(200);
  });
}}

changeLanguage()
{
  this._MyTranslateService.changeLanguage();
}
}
