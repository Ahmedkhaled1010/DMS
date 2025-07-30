import { User } from './../../Interfaces/User/user';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Login } from '../../Interfaces/User/login';
import { Register } from '../../Interfaces/User/register';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

   userToken:BehaviorSubject<any>=new BehaviorSubject(null);
   User:BehaviorSubject<any>=new BehaviorSubject(null);

  constructor(private _HttpClient:HttpClient,
    private _Router:Router
  ) {
    this._Router.navigate(['/home']);   
   }

  saveUserData()
  {
    if (localStorage.getItem("Token") != null) {
        this.userToken.next(localStorage.getItem("Token"));
       // this.userToken.next(jwtDecode(this.userToken.getValue()))
                
        console.log(this.userToken.getValue());

      
    }
    else
    {
      this.userToken.next(null);
    this._Router.navigate(['/login']);   

    }
  }
  signIn(data:Login):Observable<any>
  {
    return this._HttpClient.post(`public/login`,data)
  }
  register(data:Register):Observable<any>
  {
    return this._HttpClient.post(`public/register`,data)
  }
  getMe():Observable<any>
  {

    return this._HttpClient.get(`public/me`)

  }
 
}
