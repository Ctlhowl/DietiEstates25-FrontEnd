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

  /**
   * @description Handles the file drop event from a drag-and-drop action or file input selection
   * @param event The drop event (DragEvent) or file input change event (Event)
   */
  protected handleDrop(event: DragEvent | Event) {
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

  /**
   * @description Updates the dropzone active state based on user interaction.
   * @param isHovered Indicates whether the dropzone is hovered
   */
  protected dropzoneState(isHovered: boolean) {
    this.dropzoneActive = isHovered;
  }

  /**
   * @description Removes a file from the list based on the given index
   * @param index The index of the file to be removed
   */
  protected removeFile(index: number) {
    this.files.splice(index, 1);
  }

  /**
   * @description Uploads the selected files
   */
  uploadFiles() {
    console.log('Uploading files:', this.files);
    alert('File caricati con successo!');
  }
}
