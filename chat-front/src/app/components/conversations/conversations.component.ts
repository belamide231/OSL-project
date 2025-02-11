import { Component, NgModule, OnInit, Input, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import relativeTime from 'dayjs/plugin/relativeTime';
import dayjs from 'dayjs';

dayjs.extend(relativeTime);

import { ChatService } from '../../services/chat.service';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { ApiService } from '../../services/api.service';
import { SocketService } from '../../services/socket.service';

@Component({
  selector: 'app-conversations',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent],
  templateUrl: './conversations.component.html',
  styleUrls: ['./conversations.component.css'],
})
export class ConversationComponent implements AfterViewInit {
  messages: { sender: string; message: string; time: string; type: 'sent' | 'received'; priority?: boolean; status?: 'open' | 'pending' | 'closed'; ipLocation: string }[] = [];
  newMessage: string = '';
  selectedCategory: string = 'all';
  selectedChat: { sender: string; message: string; time: string;  type: 'sent' | 'received'; priority?: boolean; status?: 'open' | 'pending' | 'closed'; ipLocation: string } | null = null;
  showOptions: boolean = false;
  loading: boolean = false;
  composeModal: boolean = false;
  attachmentModal: boolean = false;

  public chatListHeads: any = [];
  public chatList: any[] = [];
  public chat: any = [];

  constructor(private chatService: ChatService, private readonly socket: SocketService, private readonly api: ApiService) {}

  ngAfterViewInit(): void {


    const chatContainer = document.getElementById("chatContainer");


    
    chatContainer?.addEventListener("scroll", () => {
      if(chatContainer.clientHeight + Math.abs(chatContainer.scrollTop) + 1 === chatContainer.scrollHeight) {
        this.api.loadMessages(this.chat.length, this.socket.chatmateId).subscribe(res => this.chat = this.chat.concat(res));
      }
    });


    this.fetchMessagesByCategory();

    this.api.theme().subscribe((res: any) => {
      if(isFinite(res)) 
        return;

      document.documentElement.style.setProperty('--primary-color', res.primary_color);
      document.documentElement.style.setProperty('--secondary-color', res.secondary_color);
      document.documentElement.style.setProperty('--accent-color', res.accent_color);
      document.documentElement.style.setProperty('--whites-color', res.whites_color);
    });

    this.socket.chatList.subscribe(chatList => {

      this.chatList = chatList as any;
      this.chatListHeads = chatList.map((x: any) => x[0]);

      if(chatList.length === 0)
        return;

      if(this.socket.chatmateId === 0) 
        this.socket.chatmateId = chatList[0][0].chatmate_id;

      this.chat = chatList[chatList.findIndex(x => x[0].chatmate_id === this.socket.chatmateId)];
    });
  }

  public timePassed = (stamp: string) => dayjs(stamp).fromNow();
  public selectChat = (chatmateId: number) => {
    if(this.socket.chatmateId === chatmateId)
      return;

    this.socket.chatmateId = chatmateId;
    this.chat = this.chatList[this.chatList.findIndex((x: any) => x[0].chatmate_id === this.socket.chatmateId)];
    
    const chatIndex = this.chatList.findIndex((x: any) => x[0].chatmate_id === chatmateId);
    if(chatIndex === -1) 
      return;

    if(this.chatList[chatIndex][0].content_status === 'seen')
      return;

    this.api.seenChat(chatmateId).subscribe();
  }
  public renderMessages = () => [...this.chat].reverse();

  sendMessage(): void {
    if(this.newMessage !== '') 
      this.api.sendMessage(this.chat[0].chatmate_id, this.newMessage).subscribe(res => res !== 200 ? alert('Something went wrong to our connection') : null); 
    this.newMessage = '';
  }

  fetchMessagesByCategory(): void {
    console.log('fetchMessagesByCategory');
    this.loading = true;
    this.messages = this.chatService.getMessagesByType(this.selectedCategory);
    if (this.messages.length > 0) {
      this.selectedChat = { 
        sender: this.messages[0].sender, 
        message: this.messages[0].message, 
        time: this.messages[0].time, 
        priority: this.messages[0].priority, 
        status: this.messages[0].status, 
        ipLocation: this.messages[0].ipLocation ,
        type: this.messages[0].type
      };
    }
    this.loading = false;
  }

  changeCategory(category: string): void {
    console.log('changeCategory');
    this.selectedCategory = category;
    this.fetchMessagesByCategory();
  }


  editMessage(index: number): void {
    console.log('editMessage');
    const newMessage = prompt('Edit message:', this.messages[index].message);
    if (newMessage !== null) {
      this.chatService.editMessage(index, newMessage, this.selectedCategory);
      this.fetchMessagesByCategory();
    }
  }



  viewDetails(index: number): void {
    console.log('viewDetails');
    const message = this.messages[index];
    alert(`Message details:\nSender: ${message.sender}\nTime: ${message.time}\nMessage: ${message.message}\nLocation: ${message.ipLocation}`);
  }

  getLatestMessageTime(category: string): string {
    console.log('getLatestMessageTime');
    return this.chatService.getLatestTime(category);
  }

  // New function to handle when a user clicks a message
  selectMessage(message: { sender: string; message: string; time: string; type: 'sent' | 'received'; priority?: boolean; status?: 'open' | 'pending' | 'closed'; ipLocation: string }) {
    console.log('selectMessage');
    this.selectedChat = message;
  }
  addNotes(){
    console.log('addNotes');
    alert('Notes added')
  }
  viewTranscript(){
    console.log('viewTranscript');
    alert('Transcript viewed')
  }
  deleteMessage(){
    console.log('deleteMessage');
    alert('Message deleted')
  }
 

  toggleOptions(): void {
    console.log('toggleOptions');
    this.showOptions = !this.showOptions;
  }
  showComposeModal(){
    console.log('showComposeModal');
    this.composeModal = !this.composeModal;
  }
  closeComposeModal(){
    console.log('closeComposeModal');
    this.composeModal = false;
  }
  sendComposeMessage(){
    console.log('sendComposeMessage');
    alert('Message sent')
  }
  sendAttachment(){
    console.log('sendAttachment');
    this.attachmentModal = !this.attachmentModal;
  }
  uploadFiles(){
    console.log('uploadFiles');
    alert('Files uploaded')
  }



}

