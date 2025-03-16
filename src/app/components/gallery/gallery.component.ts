import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { PhotoService } from '../../services/photo.service'; 
import { Photo } from '../../models/photo.model'; 

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent implements OnInit {
  photos: Photo[] = []; 

  constructor(private authService: AuthService, private photoService: PhotoService) { }

  ngOnInit() {
    this.loadPhotos(); 
  }

  loadPhotos(): void {
    this.photoService.getPhotosByUser(0).subscribe({ 
      next: (response) => {
        this.photos = response.filter(photo => photo.is_public); 
      },
      error: (error) => {
        console.error('Error fetching photos:', error);
      }
    });
  }
  

  logout(): void {
    this.authService.logout();
  }

  deletePhoto(photoId: number): void {
    this.photos = this.photos.filter(photo => photo.id !== photoId);
  }
}
