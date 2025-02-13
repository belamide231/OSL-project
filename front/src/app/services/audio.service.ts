import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  
  private message = new Audio('assets/audio/message.MP3');
  private messageInitialization = false;

  public playMessage = () => {
    this.message.muted = true;
    this.message.play();
  }  
}
