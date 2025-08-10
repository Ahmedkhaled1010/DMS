import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Notification } from '../../Interfaces/Notification/notification';
import { HttpClient } from '@angular/common/http';
  
@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notifications = new BehaviorSubject<Notification[]>([]);
  private unreadCount = new BehaviorSubject<number>(0);

  public notifications$ = this.notifications.asObservable();
  public unreadCount$ = this.unreadCount.asObservable();

  constructor( private _HttpClient:HttpClient) {
    this.loadMockNotifications();
  }
  getAllNotification():Observable<any>
  {
    return this._HttpClient.get("user/allNotify")
  }
  private loadMockNotifications(): void {
    // Mock notifications for demonstration
   

    this.updateUnreadCount();
  }

  getNotifications(): Observable<Notification[]> {
    return this.notifications$;
  }

  getUnreadCount(): Observable<number> {
    return this.unreadCount$;
  }

  markAsRead(notificationId: string): Observable<any> {
    const body={
      nationalID:notificationId
    }
    console.log(body);
    
   return this._HttpClient.post(`user/markAsRead`,body)
  }

  markAllAsRead(): void {
    const currentNotifications = this.notifications.value;
    const updatedNotifications = currentNotifications.map(notification => ({
      ...notification,
      read: true
    }));
    
    this.notifications.next(updatedNotifications);
    this.updateUnreadCount();
  }

  deleteNotification(notificationId: string): void {
    const currentNotifications = this.notifications.value;
    const updatedNotifications = currentNotifications.filter(
      notification => notification.id !== notificationId
    );
    
    this.notifications.next(updatedNotifications);
    this.updateUnreadCount();
  }

  addNotification(notification: Omit<Notification, 'id' | 'timestamp'>): void {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date()
    };

    const currentNotifications = this.notifications.value;
    this.notifications.next([newNotification, ...currentNotifications]);
    this.updateUnreadCount();
  }

  private updateUnreadCount(): void {
    const unread = this.notifications.value.filter(n => !n.read).length;
    this.unreadCount.next(unread);
  }

  // Utility methods
  getNotificationIcon(type: string): string {
    switch (type) {
      case 'success':
        return 'fas fa-check-circle text-green-500';
      case 'warning':
        return 'fas fa-exclamation-triangle text-yellow-500';
      case 'error':
        return 'fas fa-times-circle text-red-500';
      default:
        return 'fas fa-info-circle text-blue-500';
    }
  }

  getTimeAgo(timestamp: Date): string {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;

    return timestamp.toLocaleDateString();
  }
}
