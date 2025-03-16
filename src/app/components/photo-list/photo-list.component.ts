import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PhotoService } from '../../services/photo.service';
import { Photo } from '../../models/photo.model';
import { EditPhoto } from '../../models/edit-photo.model'; // Pastikan model EditPhoto diimpor

@Component({
  selector: 'app-photo-list',
  templateUrl: './photo-list.component.html',
  styleUrls: ['./photo-list.component.css']
})
export class PhotoListComponent implements OnInit {
  photos: Photo[] = [];
  currentUserId: number | null = null;
  photo: EditPhoto = { id: 0, title: '', url: '', is_public: true }; // Untuk edit foto

  constructor(private photoService: PhotoService, private router: Router) {}

  ngOnInit(): void {
    // Periksa apakah localStorage tersedia dan ambil userId
    if (typeof window !== 'undefined') {
      this.currentUserId = Number(localStorage.getItem('userId'));
    }

    // Cek apakah pengguna sudah login
    if (!this.currentUserId) {
      this.router.navigate(['/login']); // Arahkan ke halaman login jika tidak ada pengguna yang login
    } else {
      this.loadUserPhotos(); // Muat foto berdasarkan pengguna
    }
  }

  // Fungsi untuk memuat ulang foto berdasarkan user
  loadUserPhotos() {
    if (this.currentUserId !== null) {
      console.log('Loading photos for user ID:', this.currentUserId);
      this.photoService.getPhotosByUser(this.currentUserId).subscribe({
        next: (photos) => {
          this.photos = photos;
          console.log('Photos loaded:', photos);
        },
        error: (err) => console.error('Error loading photos:', err)
      });
    } else {
      console.error("User ID is null. Cannot load photos.");
    }
  }

  // Fungsi untuk menghapus foto dengan konfirmasi
deletePhoto(index: number) {
  const photo = this.photos[index];

  if (photo?.id) { // Pastikan photo.id ada
    const confirmDelete = window.confirm('Anda yakin ingin menghapus foto ini?');

    if (confirmDelete) {
      this.photoService.deletePhoto(photo.id).subscribe({
        next: () => {
          this.photos.splice(index, 1); // Hapus dari daftar setelah konfirmasi
          console.log('Foto berhasil dihapus.');
        },
        error: (err) => console.error('Error deleting photo:', err)
      });
    } else {
      console.log('Penghapusan dibatalkan.');
    }
  } else {
    console.error("Photo ID is undefined. Cannot delete photo.");
  }
}


  // Fungsi untuk mengedit foto
  editPhoto(index: number) {
    const photo = this.photos[index];
    const newTitle = prompt('Masukkan judul baru untuk foto:', photo.title);
  
    if (newTitle?.trim()) {
      const updatedPhoto = { ...photo, title: newTitle };
  
      this.photoService.updatePhoto(photo.id, updatedPhoto).subscribe({
        next: () => {
          this.photos[index] = updatedPhoto; // Perbarui di UI
        },
        error: (err) => console.error('Error updating photo title:', err)
      });
    }
  }

  // Fungsi untuk membuka form edit
  openEditForm(photo: Photo) {
    this.photo = { ...photo }; // Mengisi data foto yang dipilih ke dalam objek photo
  }

  // Fungsi untuk mengupdate foto melalui form
  onSubmit(event: any): void {
    event.preventDefault();
    
    this.photoService.updatePhoto(this.photo.id, this.photo).subscribe({
      next: (response) => {
        console.log('Photo updated successfully:', response);
        // Refresh list setelah update
        this.loadUserPhotos(); 
      },
      error: (error) => {
        console.error('Error updating photo:', error);
      }
    });
  }
}
