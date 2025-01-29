import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-upload-form',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './upload-form.component.html',
  styleUrl: './upload-form.component.css'
})
export class UploadFormComponent {
  files: File[] = [];
  dropzoneActive = false;

  handleDrop(event: DragEvent | Event) {
    event.preventDefault();
    event.stopPropagation();

    if (event instanceof DragEvent) {
      const files = event.dataTransfer?.files;
      if (files) {
        this.files = [...this.files, ...Array.from(files)];
      }
    } else if (event instanceof Event) {
      const fileInput = event.target as HTMLInputElement;
      const files = fileInput.files;
  
      if (files) {
        this.files = [...this.files, ...Array.from(files)];
      }
    }

    this.dropzoneActive = false;
  }

  dropzoneState(isHovered: boolean) {
    this.dropzoneActive = isHovered;
  }

  removeFile(index: number) {
    this.files.splice(index, 1);
  }

  uploadFiles() {
    console.log('Uploading files:', this.files);
    alert('File caricati con successo!');
  }
}
