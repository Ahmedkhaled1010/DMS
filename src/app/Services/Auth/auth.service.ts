import { Password, updateUser, User } from './../../Interfaces/User/user';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CustomJwtPayload, Login } from '../../Interfaces/User/login';
import { Register } from '../../Interfaces/User/register';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

   userToken:BehaviorSubject<any>=new BehaviorSubject(null);
   User:BehaviorSubject<any>=new BehaviorSubject(null);
   UserDetails:BehaviorSubject<User|null>=new BehaviorSubject<User|null>(null)
   userPic:BehaviorSubject<string>=new BehaviorSubject<string>("");
   role:BehaviorSubject<string>=new BehaviorSubject<string>("");


  constructor(private _HttpClient:HttpClient,
    private _Router:Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
  this.checkLogin()
   }

   private getLocalStorageItem(key: string): string | null {
     if (isPlatformBrowser(this.platformId)) {
       return localStorage.getItem(key);
     }
     return null;
   }

   private setLocalStorageItem(key: string, value: string): void {
     if (isPlatformBrowser(this.platformId)) {
       localStorage.setItem(key, value);
     }
   }
   checkLogin()
   {
    if (!isPlatformBrowser(this.platformId)) {
      return; // Skip during SSR
    }

    this.saveUserData()
      const token = this.getLocalStorageItem("Token");
      const role = this.getLocalStorageItem("Role")
      if (token) {
        console.log("check token");
        this.role.next(role!)
        console.log(role);

        if (role=="ADMIN") {

           this._Router.navigate(['/admin']);
                   console.log("check admin");

        }
        else
        {
           this._Router.navigate(['/home']);
           console.log("check role");

        }
      }
      else
      {
         this._Router.navigate(['/login']);
      }
   }
  saveUserData(): Observable<any>
  {
    if (!isPlatformBrowser(this.platformId)) {
      return of(null); // Skip during SSR
    }

    const token = this.getLocalStorageItem('token'); // or wherever you store it

    if (this.getLocalStorageItem("Token") != null) {
        this.userToken.next(this.getLocalStorageItem("Token"));
       this.userToken.next(jwtDecode(this.userToken.getValue()))
        const decoded:any = jwtDecode(token!);
        console.log(decoded);

        this.role.next(this.userToken.getValue().role)
         console.log();
        return this.getMe().pipe(
      tap((res) => {
        this.UserDetails.next(res.data);
        this.setLocalStorageItem("Role", this.UserDetails.getValue()?.role?.roleName!);
        this.role.next(this.UserDetails.getValue()?.role?.roleName!);
        localStorage.setItem("Role",res.data?.role?.roleName!)
      })
    );


    }
    else
    {
      this.userToken.next(null);
    this._Router.navigate(['/login']);
return of(null);
    }

  }
  signIn(data:Login):Observable<any>
  {
    return this._HttpClient.post(`public/login`,data)
  }

  // Google OAuth sign in
  signInWithGoogle(googleToken: string):Observable<any>
  {
    const data = {
      token: googleToken,
    };
    console.log(data);
    
    return this._HttpClient.post(`public/google`,data)
  }
  register(data:Register):Observable<any>
  {
    return this._HttpClient.post(`public/register`,data)
  }
  getMe():Observable<any>
  {

    return this._HttpClient.get(`public/me`)

  }
  getUserDetails(nationalId:string):Observable<any>
  
  {
    
    return this._HttpClient.get(`user/details/${nationalId}`)
  }
  uploadProfilePic(formData:FormData):Observable<any>
  {
    return this._HttpClient.post(`user/profilePicture`,formData);
  }
  getProfileImage():Observable<any>
  {
    return this._HttpClient.get(`user/profilePicture`)
  }
  updateUser(user:updateUser)
  {
    return this._HttpClient.post(`user/update`,user);
  }
  changePassword(password:Password):Observable<any>
  {
    return this._HttpClient.put("user/changePassword",password)
  }
 
}
