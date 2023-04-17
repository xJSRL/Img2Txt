import { Component } from '@angular/core';
import { createWorker } from 'tesseract.js';
import { HttpClient, HttpEventType } from '@angular/common/http';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  selectedFile!: File;
  filePreviewUrl: string | null = null;
  ocrResult = 'Null';

  constructor(private http: HttpClient) {
  }

  onFileSelected(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    if (!inputElement || !inputElement.files || !inputElement.files[0]) {
      return;
    }
    this.ocrResult = "";
    this.selectedFile = inputElement.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target) {
        const dataUrl = e.target.result as string;
        this.filePreviewUrl = dataUrl;
      }
    };
    reader.readAsDataURL(this.selectedFile);
    this.doOCR();
  }

  async doOCR() {
    const worker = await createWorker({
      logger: m => console.log(m),
    });
    await worker.load();
    await worker.loadLanguage('eng');
    await worker.initialize('eng');
    
    if (this.selectedFile) {
      const { data: { text } } = await worker.recognize(this.selectedFile);
      this.ocrResult = text;
      console.log(text);
    }
    
    await worker.terminate();
  }
  
}
