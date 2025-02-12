import { Injectable } from '@angular/core';
import { Socket, io } from 'socket.io-client';
import { BehaviorSubject, Observable } from 'rxjs';

import { DatabaseService } from './database.service';
import { ApiService } from './api.service';
import { dns } from '../../environment/dns';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket;

  private _chatList: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  public chatList: Observable<any[]> = this._chatList.asObservable();

  public chatmateId: number = 0;

  constructor(private readonly api: ApiService, private readonly database: DatabaseService) { 

    this.socket = io(dns, { withCredentials: true });
    this.socket.on('connected', () => {
      this.loadChatList();
      this.api.loadActiveClients().subscribe(res => res);
    });


    this.socket.on('receive message', async (messageId) => {

      this.api.loadMessage(messageId).subscribe((res: any) => {

        const chatIndex = this._chatList.value.findIndex((x: any) => x[0].chatmate_id === res.chatmate_id);
        if(chatIndex === -1)
          return;

        const previousChatlist = this._chatList.value;
        const updatedChat = this._chatList.value[chatIndex];

        previousChatlist.splice(chatIndex, 1);
        updatedChat.unshift(res);

        previousChatlist.unshift(updatedChat);
        this._chatList.next(previousChatlist);

        this.messageDelivered([res.chatmate_id]);
      });
    });


    this.socket.on('message delivered', (data) => {
      
      const previousChatList = this._chatList.value;
      const targetChat = previousChatList.findIndex(x => x[0].chatmate_id === data.chatmateId);

      if(targetChat === -1) 
        return;

      previousChatList[targetChat].map((x: any) => {
        if(x.chatmate_id !== x.sender_id && x.content_status === 'sent' && new Date(x.sent_at) <= new Date(data.stamp)) 
          x.content_status = 'delivered';
        return x;
      });

      this._chatList.next(previousChatList);

      const targetMessage = this._chatList.value[this._chatList.value.findIndex(x => x[0].chatmate_id === this.chatmateId)][0];
      //console.log(targetMessage.content_status);
      //console.log(targetMessage.chatmate_id !== this.chatmateId);
      if(targetMessage.chatmate_id !== this.chatmateId)
        return

      const seener = targetMessage.chatmate_id !== targetMessage.sender_id ? targetMessage.sender_id : targetMessage.receiver_id;
      if(seener === targetMessage.sender_id)
        return;

      this.seenChat(targetMessage.chatmate_id);
    });


    this.socket.on('seen message', (data) => {
      
      const chatList = this._chatList.value;
      const chatIndex = chatList.findIndex(x => x[0].chatmate_id === data.chatmate_id);
      chatList[chatIndex].map((x: any) => {
        if(x.sender_id !== x.chatmate_id && x.content_status === 'delivered' && new Date(x.sent_at) <= new Date(data.timestamp)) 
          x.content_status = 'seen';
        
        return x;
      });

      this._chatList.next(chatList);

      if(chatList[chatIndex][0].chatmate_id === this.chatmateId && chatList[chatIndex][0].sender_id === chatList[chatIndex][0].chatmate_id) {
        
        chatList[chatIndex].map((x: any) => {
          
          if(x.sender_id === x.chatmate_id && ['delivered', 'sent'].includes(x.content_status) && new Date(x.sent_at) <= new Date(data.timestamp))
            x.content_status = 'seen';

          return x;
        });

        this._chatList.next(chatList);
      }
    });
  }


  public seenChat = (chatmateId: number) => this.socket.emit("seen chat", chatmateId);
  public messageDelivered = (chatmatesId: number[]) => this.socket.emit("message delivered", chatmatesId);

  private loadChatList = () => {
    this.api.loadChatList(this._chatList.value.length).subscribe(async (res: any) => {
      if (isFinite(res)) 
        return alert('Something went wrong with your internet');

      this.messageDelivered(res.order);
      this._chatList.next(res.chatList);

      const targetMessage = this._chatList.value[this._chatList.value.findIndex(x => x[0].chatmate_id === this.chatmateId)][0];
      if(targetMessage.chatmate_id !== this.chatmateId)
        return

      const seener = targetMessage.chatmate_id !== targetMessage.sender_id ? targetMessage.sender_id : targetMessage.receiver_id;
      if(seener === targetMessage.sender_id)
        return;

      this.seenChat(targetMessage.chatmate_id);
    });
  }
}
