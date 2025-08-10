import { Component, Inject, output, PLATFORM_ID, OnInit, AfterViewInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../Services/Auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Response } from '../../Interfaces/User/response';
import { Token } from '../../Interfaces/User/token';
import { TranslateModule } from '@ngx-translate/core';
import { isPlatformBrowser } from '@angular/common';
import { GoogleLoginResponse } from '../../Interfaces/User/login';
import { GoogleAuthService } from '../../Services/google-auth.service';

// Declare google global variable
declare global {
  interface Window {
    google: any;
  }
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, TranslateModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit, AfterViewInit {
  loginResponse?: Response<Token>;
  signUpOut = output<boolean>();
  isGoogleLoading = false;
  
  constructor(
    private _AuthService: AuthService,
    private _ToastrService: ToastrService,
    private _Router: Router,
    private googleAuthService: GoogleAuthService,
    @Inject(PLATFORM_ID) private platform: object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platform)) {
      this.loadGoogleScript();
    }
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platform)) {
      setTimeout(() => {
        this.initializeGoogleSignIn();
      }, 1000);
    }
  }

  LoginForm: FormGroup = new FormGroup({
    email: new FormControl(null,[Validators.required, Validators.email]),
    password: new FormControl(null, [Validators.required]),
  });

  private loadGoogleScript(): void {
    if (document.getElementById('google-script')) {
      return; // Script already loaded
    }

    const script = document.createElement('script');
    script.id = 'google-script';
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      this.initializeGoogleSignIn();
    };
    document.head.appendChild(script);
  }

  private initializeGoogleSignIn(): void {
    if (typeof window !== 'undefined' && window.google && this.googleAuthService.isConfigured()) {
      const config = this.googleAuthService.getConfig();

      window.google.accounts.id.initialize({
        client_id: config.clientId,
        callback: (response: GoogleLoginResponse) => {
          this.handleGoogleResponse(response);
        },
        auto_select: false,
        cancel_on_tap_outside: true,
      });

      // Render the Google Sign-In button
      this.renderGoogleButton();
    } else {
      console.warn('Google OAuth not configured properly');
    }
  }

  private renderGoogleButton(): void {
    const buttonElement = document.getElementById('google-signin-button');
    if (buttonElement && window.google) {
      // Clear any existing content
      buttonElement.innerHTML = '';

      try {
        window.google.accounts.id.renderButton(buttonElement, {
          theme: 'filled_blue',
          size: 'large',
          type: 'standard',
          shape: 'rectangular',
          text: 'signin_with',
          logo_alignment: 'left',
          width: '100%'
        });
      } catch (error) {
        console.error('Failed to render Google button:', error);
        this.renderFallbackGoogleButton(buttonElement);
      }
    } else {
      const fallbackButton = document.querySelector('.google-signin-btn');
      if (fallbackButton) {
        fallbackButton.addEventListener('click', () => this.handleFallbackGoogleLogin());
      }
    }
  }

  private renderFallbackGoogleButton(container: HTMLElement): void {
    container.innerHTML = `
      <button type="button" class="google-signin-btn fallback-btn">
        <div class="google-icon">
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
        </div>
        <span>Continue with Google</span>
      </button>
    `;

    const fallbackBtn = container.querySelector('.fallback-btn');
    if (fallbackBtn) {
      fallbackBtn.addEventListener('click', () => this.handleFallbackGoogleLogin());
    }
  }

  private handleFallbackGoogleLogin(): void {
    if (window.google) {
      window.google.accounts.id.prompt();
    } else {
      this._ToastrService.warning('Warning', 'Google Sign-In is not available at the moment');
    }
  }

  private handleGoogleResponse(response: GoogleLoginResponse): void {
    if (response.credential) {
      this.isGoogleLoading = true;
      console.log('Google credential received:', response.credential);

      this._AuthService.signInWithGoogle(response.credential).subscribe({
        next: async (res) => {
          try {
            this.loginResponse = res;
            this._ToastrService.success('Login', 'Google login successful');
            console.log(this.loginResponse);

            if (isPlatformBrowser(this.platform)) {
              localStorage.setItem('Token', this.loginResponse?.data.token!);
            }

            await this._AuthService.saveUserData();

            const role = this._AuthService.role.getValue();
            console.log(role);
            localStorage.setItem("Role", role);

            if (role != "ADMIN") {
              this._Router.navigate(['/home']);
            } else {
              this._Router.navigate(['/admin']);
            }
          } catch (error) {
            console.error('Error processing Google login response:', error);
            this._ToastrService.error('Login', 'Failed to process Google login');
          } finally {
            this.isGoogleLoading = false;
          }
        },
        error: (error) => {
          this._ToastrService.error('Login', 'Google login failed');
          console.error('Google login error:', error);
          this.isGoogleLoading = false;

          // Provide more specific error messages based on error type
          if (error.status === 401) {
            this._ToastrService.error('Error', 'Google account not authorized');
          } else if (error.status === 400) {
            this._ToastrService.error('Error', 'Invalid Google credentials');
          } else {
            this._ToastrService.error('Error', 'Google login service unavailable');
          }
        },
      });
    } else {
      this._ToastrService.error('Error', 'No Google credentials received');
    }
  }

  async login() {
    this._AuthService.signIn(this.LoginForm.value).subscribe({
      next: async (res) => {
        this.loginResponse = res;
        this._ToastrService.success('Login', 'Login successfully');
        console.log(this.loginResponse);

        if (isPlatformBrowser(this.platform)) {
          localStorage.setItem('Token', this.loginResponse?.data.token!);
        }

        await this._AuthService.saveUserData();

        const role = this._AuthService.role.getValue()
        console.log(role);
        localStorage.setItem("Role",role)
        if (role != "ADMIN") {
          this._Router.navigate(['/home']);
        } else {
          this._Router.navigate(['/admin']);
        }
      },
      error: (error) => {
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
