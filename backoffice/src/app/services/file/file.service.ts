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
  private apiS3 = `${environment.apiS3}`;
  private apiEstateHandle = `${environment.apiEstateHandle}`;
  
  constructor(private http: HttpClient) { }

  /**
   * Fetches a pre-signed URL for uploading a file from S3.
   * @param file Name of file to be uploaded.
   * @returns An Observable containing the pre-signed URL.
   */
  public getPresignedUpload(file: string): Observable<ApiResponse<string>> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
    });
    return this.http.get<ApiResponse<string>>(`${this.apiS3}/presigned-upload`, { headers, params: { file: file } });
  }

  /**
   * Uploads a file directly to S3 using the pre-signed URL.
   * @param url The pre-signed URL.
   * @param file The file to upload.
   * @returns An Observable for tracking the upload request.
   */
  public uploadFileToS3(presignedUrl: string, file: File): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': file.type
    });

    return this.http.put(presignedUrl, file, { headers, responseType: 'text' });
  }

   /**
   * Fetches a pre-signed URL for deleting a file from S3.
   * @param file Name of file to be deleted.
   * @returns An Observable containing the pre-signed URL.
   */
  public getPresignedDelete(file: string): Observable<ApiResponse<string>> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
    });

    return this.http.get<ApiResponse<string>>(`${this.apiS3}/presigned-delete`, {headers, params: { file: file } });
  }

  /**
   * Delete a file directly to S3 using the pre-signed URL.
   * @param url The pre-signed URL.
   * @returns An Observable for tracking the de;ete request.
   */
  public deleteFileToS3(presignedUrl: string): Observable<any> {
    return this.http.delete(presignedUrl);
  }

  public deleteMetaFileEstate(file: string): Observable<ApiResponse<boolean>> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
    });

    return this.http.delete<ApiResponse<boolean>>(`${this.apiEstateHandle}/files`, {headers, params: { file: file } })
  }
}
