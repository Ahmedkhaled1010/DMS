import { Component, Inject, output, PLATFORM_ID } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../Services/Auth/auth.service';

import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Response } from '../../Interfaces/User/response';
import { Token } from '../../Interfaces/User/token';
import { TranslateModule } from '@ngx-translate/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, TranslateModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  loginResponse?: Response<Token>;
  signUpOut = output<boolean>();
  ngOnInit(): void {}
  constructor(
    private _AuthService: AuthService,
    private _ToastrService: ToastrService,
    private _Router: Router,
    @Inject(PLATFORM_ID) private platform: object
  ) {}

  LoginForm: FormGroup = new FormGroup({
    email: new FormControl(null),
    password: new FormControl(null),
  });

  login() {
    this._AuthService.signIn(this.LoginForm.value).subscribe({
      next: (res) => {
        this.loginResponse = res;
        this._ToastrService.success('Login', 'Login successfully');
        console.log(this.loginResponse);

        localStorage.setItem('Token', this.loginResponse?.data.token!);
        this._AuthService.saveUserData();
        this._Router.navigate(['/home']);
      },
      error: (error) => {
        console.log(13);

        this._ToastrService.error('Login', 'unsuccessfully');

        console.log(error);
      },
    });
  }
  signUp() {
    this.signUpOut.emit(true);
  }
  passwordVisible() {
    if (isPlatformBrowser(this.platform)) {
      const passwordInput = document.getElementById(
        'password'
      ) as HTMLInputElement;
      const iconShow = document.getElementById('iconShow')!;
      const iconHide = document.getElementById('iconHide')!;
      const isPassword = passwordInput?.type === 'password';
      passwordInput!.type = isPassword ? 'text' : 'password';
      if (isPassword) {
        iconShow.classList.add('hidden');
        iconHide.classList.remove('hidden');
      } else {
        iconShow.classList.remove('hidden');
        iconHide.classList.add('hidden');
      }
    }
  }
}
