import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Login } from '../../Interfaces/login';
import { Register } from '../../Interfaces/register';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

   userToken:BehaviorSubject<any>=new BehaviorSubject(null)

  constructor(private _HttpClient:HttpClient) {
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
      this.userToken.next(null)
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
