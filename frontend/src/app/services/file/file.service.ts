import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environments';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../serialization/apiResponse';
import { S3File } from '../../interfaces/s3File';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  private apiS3 = `${environment.apiS3}`
  
  constructor(private http: HttpClient) { }

  /**
   * Fetches a pre-signed URL from the backend for uploading a file to S3.
   * @param file Name of file to be uploaded.
   * @returns An Observable containing the pre-signed URL.
   */
  public getPresignedUrl(file: string): Observable<ApiResponse<string>> {
    return this.http.get<ApiResponse<string>>(`${this.apiS3}/presigned-url`, { params: { file: file } });
  }

  /**
   * Uploads a file directly to S3 using the pre-signed URL.
   * @param url The pre-signed URL.
   * @param file The file to upload.
   * @returns An Observable for tracking the upload request.
   */
  public uploadFileToS3(presignedUrl: string, file: File): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': file.type });

    return this.http.put(presignedUrl, file, { headers, responseType: 'text' });
  }
}
