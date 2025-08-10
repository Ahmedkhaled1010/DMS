// models/chat-message.model.ts
export interface ChatMessage {
  type: MessageType;
  content: string;
  sender: string;
}

export type MessageType = 'CHAT' | 'JOIN' | 'LEAVE';

// models/chat-message.model.ts
export interface ChatMessages {
  
  id:string,
  participants:string[],
  messages:Messages[],
    timestamp:Date


}
export interface Notify
{
  title:string,
   content: string;
}
export interface Messages
{
  id:string,
  sender:string,
  content:string,
  timestamp:Date
}