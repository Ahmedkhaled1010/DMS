import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Client, IMessage, Stomp } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private stompClient?: Client;

  constructor(private _HttpClient:HttpClient) { }

  getAllChats():Observable<any>
  {
    return this._HttpClient.get("api/chat/all");
  }
  getChatsBetween(from:string,to:string):Observable<any>
  {
    return this._HttpClient.get(`api/chat/${from}/${to}`)
  }
  createChat(userName:string):Observable<any>
  {
    return this._HttpClient.get(`api/chat/create/${userName}`)
  }
 /* sendMessage(from:string,to:string,message:string):Observable<any>
  {
    const body={
      "from":from,
    "to":to,
    
    "content":message
    }
   return this._HttpClient.post('api/chat/send',body)
  }*/
 
   sendMessage(from:string,toUsername: string, content: string): void {
    const message = {
      from:from,
      to: toUsername,
      content: content,
    };
    console.log(5555555555);
    

    this.stompClient?.publish({
      destination: '/app/send', // لازم تتأكد إن دا نفس الـ mapping في Spring
      body: JSON.stringify(message),
    });
  }
}
