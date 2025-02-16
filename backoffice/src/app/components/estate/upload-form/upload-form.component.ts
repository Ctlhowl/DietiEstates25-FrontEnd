import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as uuid from 'uuid';
import { S3File } from '../../../interfaces/s3File';
import { FileService } from '../../../services/file/file.service';
import { ApiResponse } from '../../../serialization/apiResponse';

@Component({
  selector: 'app-upload-form',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './upload-form.component.html',
  styleUrl: './upload-form.component.css'
})
export class UploadFormComponent {
  protected files: File[] = [];
  protected dropzoneActive = false;

  @Input() filesEdit: S3File[] = [];
  @Output() filesData = new EventEmitter<File[]>();
  

  constructor(private fileService: FileService) { }

  /**
   * @description Notify parent
   */
  public notify(): void {
    this.filesData.emit(this.files)
  }

  /**
   * @description Add UUID to the file name
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
        this.files.forEach(file => { this.uploadFileOnS3(file) });
        
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
    this.deleteFileFromS3(fileName);
    
    this.notify();
  }

  /**
   * @description Delete a file from S3
   * @param {string} fileName File's name to delete 
   */
  private deleteFileFromS3(fileName: string): void {
    this.fileService.getPresignedDelete(fileName).subscribe(
      {
        next: (response: ApiResponse<string>) => {
          const presignedUrl = response.data;
          this.fileService.deleteFileToS3(presignedUrl).subscribe();
        },
        complete: () => {
          this.fileService.deleteMetaFileEstate(fileName).subscribe();
        }
      }
    );
  }

   /**
     * @description Upload a file on S3
     * @param {File} file File to be uploaded on S3
     */
    private uploadFileOnS3(file: File): void {
      this.fileService.getPresignedUpload(file.name).subscribe(
        {
          next: (response: ApiResponse<string>) => {
            const presignedUrl = response.data;
            this.fileService.uploadFileToS3(presignedUrl, file).subscribe();
          }
        }
      );
    }
}
