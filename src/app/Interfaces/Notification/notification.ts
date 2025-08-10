export interface Notification {
  id: string;
  title: string;
  content: string;
  timestamp: Date;
  read: boolean;
 
}

export interface NotificationResponse {
  data: Notification[];
  unreadCount: number;
  total: number;
}
export interface Notify
{
  title:string;
  sender:string,
  timestamp:string,
  content:string
}