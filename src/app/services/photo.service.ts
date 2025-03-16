import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PhotoAdd } from '../models/photo-add.model';
import { Photo } from '../models/photo.model';
import { EditPhoto } from '../models/edit-photo.model';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  private apiUrl = 'http://localhost:3000/photos'; // Ganti dengan URL API yang sesuai

  constructor(private http: HttpClient) {}

  // Method untuk mengambil foto berdasarkan ID
  getPhotoById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  // Method untuk mengambil foto berdasarkan userId
  getPhotosByUser(userId: number): Observable<Photo[]> {
    return this.http.get<Photo[]>(`${this.apiUrl}?userId=${userId}`);
  }

  // Mengunggah foto dengan file
  uploadPhoto(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/upload`, formData); // Tambahkan /upload
  }

  // Menambah foto dengan URL
  addPhoto(photo: PhotoAdd): Observable<any> {
    return this.http.post<any>(this.apiUrl, photo);
  }

  // Menghapus foto
  deletePhoto(photoId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${photoId}`);
  }

  // Method untuk memperbarui foto
  updatePhoto(id: number, photo: EditPhoto): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, photo);
  }
}
