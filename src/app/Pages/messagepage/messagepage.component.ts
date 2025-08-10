import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Import FormsModule for ngModel
import { AuthService } from '../../Services/Auth/auth.service';
import { User } from '../../Interfaces/User/user';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from '../../Services/Message/message.service';
import {
  ChatMessage,
  ChatMessages,
  Messages,
} from '../../Interfaces/Message/message';
import { Document, DocumentModel } from '../../Interfaces/Document/document';
import { DocumentService } from '../../Services/Document/document.service';
import { Client, Message } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

@Component({
  selector: 'app-messagepage',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './messagepage.component.html',
  styleUrl: './messagepage.component.scss',
})
export class MessagepageComponent {
  private stompClient: Client = new Client();

  chats: any[] = [];
  document?: DocumentModel;
  selectedChat?: ChatMessages;
  messages: Messages[] = [];
  newMessage = '';
  from?: string;
  user?: User;
  chatMessages: ChatMessages[] = [];
  documentId: string = '';
  to: string = '';
  documentName=''
  docnew=''
  constructor(
    private _AuthService: AuthService,
    private _MessageService: MessageService,
    private _ActivatedRoute: ActivatedRoute,
    private _DocumentService: DocumentService
  ) {}

  ngOnInit(): void {
        this.documentId = this._ActivatedRoute.snapshot.paramMap.get('id') || '';
        this.documentName = this._ActivatedRoute.snapshot.paramMap.get('name') || '';
         this.initialData();
 this.socket();
    console.log(this._AuthService.userToken.getValue());
    
  }

  socket() {
    const socket = new SockJS('http://localhost:8080/ws');
    console.log(this._AuthService.userToken.getValue());
    
    this.stompClient = new Client({
      webSocketFactory: () => socket,
      debug: (str) => console.log(str),
      reconnectDelay: 5000,
      connectHeaders: {
        Authorization: `Bearer ${localStorage.getItem("Token")}`, // ضيف التوكن هنا يدويًا
      },
      onConnect: () => {
        console.log('✅ WebSocket Connected');

        if (!this.user?.userName) return;
        console.log(this.user.userName);
        this.stompClient.subscribe('/topic/notifications', (message) => {
  console.log('📥 من /topic/test:', message.body);
});

        this.stompClient.subscribe(
          `/user/queue/notifications`,
          (message: Message) => {
            const chatMessage = JSON.parse(message.body);
            console.log(123);

            console.log('📩 رسالة جديدة وصلت:', chatMessage);

            if (this.selectedChat?.participants.includes(chatMessage.sender)) {
              this.messages.push(chatMessage);
            }

            //this.loadChats();
          }
        );
      },
      onStompError: (frame) => {
        console.error('❌ STOMP error:', frame);
      },
    });

    this.stompClient.activate();
  }

  async initialData() {
    this._AuthService.UserDetails.subscribe((res) => {
      this.user = res!;
     
    });
    if (this.documentId!='') {
       this.getReceiverDetais();
    }
  
       this.loadChats();

  }

  loadChats(): void {
    this._MessageService.getAllChats().subscribe({
      next: (res) => {
        console.log(res);
        this.chatMessages = res.data;
        console.log(this.chatMessages);
        if (this.docnew!='') {
          this.selectChat(this.docnew,this.to)
        }
        
      },
      error: (err) => {
        console.log(err);
      },
    });

    // Mock chat data
  }
  createChat(userName:string)
  {
    this._MessageService.createChat(userName).subscribe({
      next:(res)=>{
        console.log(res);
        
      },
      error:(err)=>{
        console.log(err);
        
      }
    })
  }
  selectChat(chat: string, receiver: string): void {
    this.to = receiver;

    this.selectedChat = this.chatMessages.find((c) => c.id === chat);

    this.messages = this.selectedChat?.messages!; // Copy messages to avoid direct mutation
    this.newMessage = ''; // Clear input field
  }

  sendMessage(): void {
    if (this.newMessage.trim() && this.selectedChat) {
      console.log(this.to);

      const message = {
        from: this.user?.userName!,
        to: this.to,
        content: this.newMessage,
      };
      console.log(5555555555);

      this.stompClient?.publish({
        destination: '/app/send', // لازم تتأكد إن دا نفس الـ mapping في Spring
        body: JSON.stringify(message),
        headers: {
          Authorization: `Bearer ${this._AuthService.userToken.getValue()}`,
        },
      });

      // this._MessageService.sendMessage(this.user?.userName!,this.to,this.newMessage);
      /* this._MessageService.sendMessage(this.user?.userName!,this.to,this.newMessage).subscribe({
          next:(res)=>{
            console.log(res);
          //  this.loadChats()
           // this.selectChat(chat,receiver);
          },
          error:(err)=>{
            console.log(err);
            
          }
        })*/
      /*  this._MessageService.sendMessage(this.user?.userName,)
        const now = new Date()
        const timeString = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        this.messages.push({
          sender: "me",
          text: this.newMessage.trim(),
          time: timeString,
        })*/
      // Optionally, update the last message in the chat list
      // this.selectedChat.lastMessage = this.newMessage.trim()
      // this.selectedChat.time = timeString

      // Scroll to the bottom of the messages container (requires DOM manipulation, often done with ViewChild)
      // For simplicity, this is omitted here but would be a common next step.
    }
    this.newMessage = '';
  }
  async getReceiverDetais() {
  this._DocumentService.getDocumentOwner(this.documentId).subscribe({
    next: (res) => {
      console.log(res);
      this.to = res.data.userName;
      console.log(this.to);

      // ✅ لو documentId موجود، نعمل create chat ونستنى تخلص
      if (this.documentId != '') {
        this._MessageService.createChat(this.to).subscribe({
          next: (res) => {
            console.log('✅ Chat created:', res);
             
            this.loadChats();
           

           this.docnew=res.data.id;
          
          },
          error: (err) => {
            console.log(err);
          },
        });
      } else {
        this.loadChats(); // لو مفيش documentId نعمل load عادي
      }
    },
    error: (err) => {
      console.log(err);
    },
  });
}


  getDoucmentDetails() {
    /*this._DocumentService.getDocumentById(this.documentId).subscribe({
      next: (res) => {
        console.log(res);

        this.document = res.data;
        this.getReceiverDetais(this.document?.nationalID!);
      },
      error: (err) => {
        console.log(err);
      },
    });*/
  }
  receiver(list: string[]): string {
    let receiver: string;
    for (let i = 0; i < 2; i++) {
      if (list[i] != this.user?.userName) {
        receiver = list[i];
      }
    }

    return receiver!;
  }
  lastMessage(message: Messages[]): string {
      let messages=""
    if (message.length>0) {
          let messages = message[message.length - 1];
         return messages.content;
    }
   return messages;
  }
  lastMessageDate(message: Messages[]): Date {
    if (message.length>0) {
          let messages = message[message.length - 1];
        return messages.timestamp;
    }
   return new Date;
  }
    
  
}
