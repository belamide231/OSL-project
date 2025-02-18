import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements AfterViewInit {
  title = 'widget';

  initialSectionHeight: number = 0;
  initialTextAreaHeight: number = 0;
  initialLabelHeight: number = 0;
  @ViewChild('section') section!: ElementRef<HTMLDivElement>;
  @ViewChild('label') label!: ElementRef<HTMLLabelElement>;
  @ViewChild('textarea') textarea!: ElementRef<HTMLTextAreaElement>;

  ngAfterViewInit(): void {
    this.initialSectionHeight = this.section.nativeElement.clientHeight;
    this.initialLabelHeight = this.label.nativeElement.clientHeight;
    this.initialTextAreaHeight = this.textarea.nativeElement.clientHeight;
    if(this.textarea && this.label) {
      this.textarea.nativeElement.addEventListener('input', () => {
        const section = this.section.nativeElement;
        const label = this.label.nativeElement;
        const textarea = this.textarea.nativeElement;
        textarea.style.height = 'fit-content';

        if(textarea.scrollHeight >= 144) {
          section.style.height = `${(this.initialSectionHeight + this.initialTextAreaHeight + 2) - 144}px`
          label.style.height = `${(this.initialLabelHeight - this.initialTextAreaHeight) + 144}px`;  
          textarea.style.height = `${144}px`;
          textarea.style.overflowY = 'auto';
        } else {
          section.style.height = `${(this.initialSectionHeight + this.initialTextAreaHeight + 1) - textarea.scrollHeight}px`
          label.style.height = `${(this.initialLabelHeight - this.initialTextAreaHeight + 2) + textarea.scrollHeight}px`;  
          textarea.style.height = `${textarea.scrollHeight}px`;
          textarea.style.overflowY = 'hidden';
        }
      });
    }
  }
}
