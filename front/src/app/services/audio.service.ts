import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  
  private message = new Audio('assets/audio/message.MP3');
  private messageInitialization = false;

  public playMessage = () => {
    if(!this.messageInitialization) {
      this.message.muted = true;
      this.message.play().then(() => {
        setTimeout(() => {
          this.message.muted = false;
        }, 1000);
      }).catch(error => console.log("Autoplay blocked:", error));
      this.messageInitialization = true;
    
    }       
    
    this.message.currentTime = 0;
    this.message.play().catch(error => console.log("Play blocked:", error));
  }  
}
