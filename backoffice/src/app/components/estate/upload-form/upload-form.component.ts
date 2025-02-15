import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as uuid from 'uuid';
import { S3File } from '../../../interfaces/s3File';

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

  @Input() filesEdit: S3File[] = [];
  @Output() filesData = new EventEmitter<File[]>();
  

  /**
   * Notify parent
   */
  public notify(): void {
    this.filesData.emit(this.files)
  }

  /**
   * Add UUID to the file name
   * @param originalFile File to be rename
   * @returns {File} renamed with UUID
   */
  renameFile(originalFile: File): File {
    const uniqueName = `${uuid.v4()}-${originalFile.name}`;
    return new File([originalFile], uniqueName, { type: originalFile.type });
  }

  /**
   * @description Handles the file drop event from a drag-and-drop action or file input selection
   * @param event The drop event (DragEvent) or file input change event (Event)
   */
  protected handleDrop(event: DragEvent | Event): void {
    event.preventDefault();
    event.stopPropagation();

    let newFiles: File[] = [];

    if (event instanceof DragEvent) {
      const files = event.dataTransfer?.files;
      if (files) {
        newFiles = Array.from(files).map(this.renameFile);
      }
    } else if (event instanceof Event) {
      const fileInput = event.target as HTMLInputElement;
      const files = fileInput.files;
  
      if (files) {
        newFiles = Array.from(files).map(this.renameFile);
      }

      if (newFiles.length > 0) {
        this.files = [...this.files, ...newFiles];
        this.notify();
      }
  
    }
    this.dropzoneActive = false;
  }

  /**
   * @description Updates the dropzone active state based on user interaction.
   * @param isHovered Indicates whether the dropzone is hovered
   */
  protected dropzoneState(isHovered: boolean): void {
    this.dropzoneActive = isHovered;
  }

  /**
   * @description Removes a file from the list based on the given index
   * @param index The index of the file to be removed
   * @param fileName Name of the file to be removed
   */
  protected removeFile(index: number, fileName: string): void {
    this.filesEdit.splice(index, 1);
    this.files.splice(index, 1);
    
    this.notify();
  }

  private s3Remove(fileName: string): void {
    
  }
}
