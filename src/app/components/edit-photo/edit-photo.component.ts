import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PhotoService } from '../../services/photo.service';
import { EditPhoto } from '../../models/edit-photo.model'; // Import model EditPhoto

@Component({
  selector: 'app-edit-photo',
  templateUrl: './edit-photo.component.html',
  styleUrls: ['./edit-photo.component.css']
})
export class EditPhotoComponent implements OnInit {
  photoId!: number; // ID foto yang akan diedit
  photo: EditPhoto = { id: 0, title: '', url: '', is_public: true }; // Inisialisasi dengan model
  isDisabled: boolean = true;

  constructor(
    private router: Router,
    private photoService: PhotoService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Ambil ID dari route
    this.photoId = Number(this.route.snapshot.paramMap.get('id'));
    // Muat data foto dari database
    this.loadPhoto(); 
  }

  loadPhoto(): void {
    // Ambil data foto berdasarkan ID
    this.photoService.getPhotoById(this.photoId).subscribe({
      next: (photo) => {
        this.photo = { ...photo }; // Menyalin data foto ke variabel photo
      },
      error: (error) => {
        console.error('Error loading photo:', error);
      }
    });
  }

  onPublicStatusChange(event: any): void {
    // Update status publik berdasarkan checkbox
    this.photo.is_public = event.target.checked; // Mengatur status public sesuai checkbox
    console.log('Public status changed:', this.photo.is_public); // Log status baru
  }

  onSubmit(event: Event) {
    event.preventDefault(); // Mencegah perilaku default form
    console.log('Form submitted', this.photo); // Log data untuk verifikasi
    
    this.photoService.updatePhoto(this.photo.id, this.photo).subscribe({
      next: () => {
        console.log('Photo updated successfully.');
        // Navigasi ke halaman 'photo-list' setelah berhasil memperbarui foto
        this.router.navigate(['/photo-list']);
      },
      error: (err) => {
        console.error('Error updating photo:', err);
        // Tampilkan pesan kesalahan jika diperlukan
      }
    });
  }
}
