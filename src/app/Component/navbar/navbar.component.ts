import { Component, input, Inject, PLATFORM_ID, OnInit, OnDestroy, HostListener } from '@angular/core';
import { User } from '../../Interfaces/User/user';
import { MyTranslateService } from '../../Services/Translate/my-translate.service';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../Services/Auth/auth.service';
import { ThemeService } from '../../Services/Theme/theme.service';
import { NotificationService } from '../../Services/Notification/notification.service';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { Notification, Notify } from '../../Interfaces/Notification/notification';
import { Subscription } from 'rxjs';
import { Client, Message } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit, OnDestroy {
    private stompClient: Client = new Client();

  user=input<User>();
  profilePic:string=""
  isDarkMode: boolean = false;
  notify:Notify|undefined=undefined
  // Notification properties
  notifications: Notification[] = [];
  unreadCount: number =0;
  showNotificationDropdown: boolean = false;
  private subscriptions: Subscription[] = [];

  constructor(
    private _MyTranslateService:MyTranslateService,
    private _AuthService:AuthService,
    private themeService: ThemeService,
    private notificationService: NotificationService,
    @Inject(PLATFORM_ID) private platformId: Object
  )
  {

  }
  ngOnInit(): void {
    this._AuthService.userPic.subscribe((res)=>{
      this.profilePic=this._AuthService.userPic.getValue()
    })
    this.getProfile()
    this.getAllNotification()
    // Subscribe to theme changes
    const themeSub = this.themeService.theme$.subscribe(theme => {
      this.isDarkMode = theme === 'dark';
    });
    this.subscriptions.push(themeSub);

    // Subscribe to notifications
/*
        const notificationSub = this.notificationService.getNotifications().subscribe(notifications => {
      this.notifications = notifications;
    });
*/
  //  this.subscriptions.push(notificationSub);

  
    this.socket();
  }
  socket() {
      const socket = new SockJS('http://localhost:8080/ws');
  
      this.stompClient = new Client({
        webSocketFactory: () => socket,
        debug: (str) => console.log(str),
        reconnectDelay: 5000,
        connectHeaders: {
        Authorization: `Bearer ${localStorage.getItem("Token")}`, // ضيف التوكن هنا يدويًا
        },
        onConnect: () => {
          console.log('✅ WebSocket Connected');
          
       
          this.stompClient.subscribe('/topic/notifications', (message) => {
              this.getAllNotification()
            this.notify=JSON.parse(message.body)
            console.log(this.notify);
          
    console.log('📥 من /topic/test:', message.body);
  });
  
        
        },
        onStompError: (frame) => {
          console.error('❌ STOMP error:', frame);
           
        },
      });
  
      this.stompClient.activate();
    }
  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
  changeLanguage()
  {
    this._MyTranslateService.changeLanguage();
  }
  getProfile()
  {
    this._AuthService.getProfileImage().subscribe(
      {
        next:(res)=>{
          console.log(res);
          this.profilePic=res.data
          
        }
      }
    )
  }
  logOut()
  {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem("Token");
      localStorage.removeItem("Role");
    }
    this._AuthService.saveUserData();
  }
  getAllNotification()
  {
    this.notificationService.getAllNotification().subscribe(
      {
        next:(res)=>{
          this.notifications=res.data.notifications
          console.log(res);
          this.unreadCount=this.notifications.length

          
        },
        error:(err)=>{
          console.log(err);
          
        }
      }
    )
  }
  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  // Notification methods
  toggleNotificationDropdown(): void {
    this.showNotificationDropdown = !this.showNotificationDropdown;
  }

  closeNotificationDropdown(): void {
    this.showNotificationDropdown = false;
  }

  markNotificationAsRead(notificationId: string, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.notificationService.markAsRead(notificationId).subscribe(
      {
        next:(res)=>{
          console.log(res);
          this.getAllNotification()
        },
        error:(err)=>{
          console.log(err);
          
        }
      }
    );
  }

  markAllAsRead(): void {
    this.notificationService.markAllAsRead();
  }

  deleteNotification(notificationId: string, event: Event): void {
    event.stopPropagation();
    this.notificationService.deleteNotification(notificationId);
  }

  getTimeAgo(timestamp: Date): string {
    return this.notificationService.getTimeAgo(timestamp);
  }

  

  trackNotification(index: number, notification: Notification): string {
    return notification.id;
  }

  // Close dropdown when clicking outside
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const target = event.target as HTMLElement;
    const notificationContainer = target.closest('.relative');

    if (this.showNotificationDropdown && !notificationContainer) {
      this.showNotificationDropdown = false;
    }
  }

}
