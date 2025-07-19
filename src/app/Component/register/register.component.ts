import { Component, Inject, output, PLATFORM_ID, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../Services/Auth/auth.service';

import { AbstractControl, Validators, ValidationErrors } from '@angular/forms';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { Register } from '../../Interfaces/register';
import {} from '@angular/compiler';
import { Response } from '../../Interfaces/response';
import { Token } from '../../Interfaces/token';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, TranslateModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  registerData = signal<Register | null>(null);
  registerResponse!: Response<Token>;
  loginOut = output<boolean>();

  constructor(
    private _AuthService: AuthService,
    private _ToastrService: ToastrService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}
  ngOnInit(): void {
    this.passwordVisible();
  }
  registerForm: FormGroup = new FormGroup(
    {
      name: new FormControl(null, [
        Validators.required,
        Validators.minLength(5),
      ]),
      userName: new FormControl(null, [
        Validators.required,
        Validators.minLength(3),
      ]),
      mobileNumber: new FormControl(null, [
        Validators.required,
        Validators.pattern(/^01[0-9]{9}$/),
      ]),
      nationalID: new FormControl(null, [
        Validators.required,
        Validators.pattern(/^[0-9]{14}$/),
      ]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      confirmEmail: new FormControl(null, [
        Validators.required,
        Validators.email,
      ]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(5),
      ]),
      confirmPassword: new FormControl(null, [
        Validators.required,
        Validators.minLength(5),
      ]),
    },
    {
      validators: [
        matchValues('email', 'confirmEmail'),
        matchValues('password', 'confirmPassword'),
      ],
    }
  );
  register() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();

      const controls = this.registerForm.controls;

      if (controls['name'].invalid) {
        this._ToastrService.error('الاسم مطلوب ويجب أن يكون على الأقل 5 حروف');
        return;
      }

      if (controls['userName'].invalid) {
        this._ToastrService.error(
          'اسم المستخدم مطلوب ويجب أن يكون على الأقل 3 حروف'
        );
        return;
      }

      if (controls['mobileNumber'].invalid) {
        this._ToastrService.error('رقم الهاتف غير صحيح');
        return;
      }

      if (controls['nationalID'].invalid) {
        this._ToastrService.error('الرقم القومي يجب أن يتكون من 14 رقم');
        return;
      }

      if (controls['email'].invalid) {
        this._ToastrService.error('صيغة البريد الإلكتروني غير صحيحة');
        return;
      }

      if (controls['confirmEmail'].invalid) {
        this._ToastrService.error('تأكيد البريد الإلكتروني غير صحيح');
        return;
      }

      if (this.registerForm.errors?.['emailMismatch']) {
        this._ToastrService.error('البريد الإلكتروني وتأكيده غير متطابقين');
        return;
      }

      if (controls['password'].invalid) {
        this._ToastrService.error('كلمة المرور قصيرة أو غير صحيحة');
        return;
      }

      if (controls['confirmPassword'].invalid) {
        this._ToastrService.error('تأكيد كلمة المرور غير صحيح');
        return;
      }

      if (this.registerForm.errors?.['passwordMismatch']) {
        this._ToastrService.error('كلمتا المرور غير متطابقتين');
        return;
      }
    }
    this.registerData.set(this.registerForm.value);
    console.log();
    this._AuthService.register(this.registerData()!).subscribe({
      next: (res) => {
        console.log(res);
        this._ToastrService.success('Register', 'Register successfully');
        localStorage.setItem('Token', this.registerResponse?.data.token);
        this._AuthService.saveUserData();
      },
      error: (err) => {
        this._ToastrService.error('Register', 'unsuccessfully');

        console.log(err);
      },
    });
  }
  login() {
    this.loginOut.emit(false);
  }

  passwordVisible() {
    if (isPlatformBrowser(this.platformId)) {
      const passwordInput = document.getElementById(
        'password'
      ) as HTMLInputElement;
      const toggleBtn = document.getElementById('togglePassword1');
      const iconShow = document.getElementById('iconShow')!;
      const iconHide = document.getElementById('iconHide')!;
      toggleBtn?.addEventListener('click', () => {
        const isPassword = passwordInput?.type === 'password';
        passwordInput!.type = isPassword ? 'text' : 'password';
        if (isPassword) {
          iconShow.classList.add('hidden');
          iconHide.classList.remove('hidden');
        } else {
          iconShow.classList.remove('hidden');
          iconHide.classList.add('hidden');
        }
      });
    }
  }
}
function matchValues(controlName: string, matchingControlName: string) {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    const control = formGroup.get(controlName);
    const matchingControl = formGroup.get(matchingControlName);

    if (!control || !matchingControl) return null;

    if (matchingControl.errors && !matchingControl.errors['mustMatch'])
      return null;

    if (control.value !== matchingControl.value) {
      matchingControl.setErrors({ mustMatch: true });
    } else {
      matchingControl.setErrors(null);
    }

    return null;
  };
}
