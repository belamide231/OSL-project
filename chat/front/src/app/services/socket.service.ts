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

  private _activeClients: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  public activeClients: Observable<any[]> = this._activeClients.asObservable();

  constructor(private readonly api: ApiService, private readonly database: DatabaseService) { 

    this.socket = io(dns, { withCredentials: true });
    this.socket.on('connected', () => {

      this.loadChatList();
      this.api.laodActiveClients().subscribe();
    });


    this.socket.on('new message', async (messageId) => {

      this.api.loadMessage(messageId).subscribe((res: any) => {
        const index = this._chatList.value.findIndex((x: any) => x[0].chatmate_id === res.chatmate_id);
        if(index === -1)
          return;

        const updated = this._chatList.value[index];
        const prev = this._chatList.value;

        prev.splice(index, 1);
        updated.unshift(res);

        prev.unshift(updated);
        this._chatList.next(prev);
      });
    });


    this.socket.on('seen message', (object) => {

      const index = this._chatList.value.findIndex(x => x[0].chatmate_id === object.chatmate_id);
      const prev = this._chatList.value[index];
      
      console.log(prev);

      prev.map((x: any, i: number) => {
        if(x.sender_id === object.chatmate_id && x.sent_at <= object.timestamp && x.content_status === 'delivered') {
          x.content_status = 'seen';
        }

        return x;
      });

      //setTimeout(() => {
      //  console.log(prev);
      //}, 1000);

      //this._chatList.next(prev);
    });
  }

  private loadChatList = () => {
    this.api.loadChatList(this._chatList.value.length).subscribe(async (res: any) => {
      if (isFinite(res)) 
        return alert('Something went wrong with your internet');
  
      this._chatList.next(res.chatList);
    });
  }
}
