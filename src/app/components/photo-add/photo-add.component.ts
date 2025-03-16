import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PhotoService } from '../../services/photo.service';
import { PhotoAdd } from '../../models/photo-add.model';

@Component({
  selector: 'app-photo-add',
  templateUrl: './photo-add.component.html',
  styleUrls: ['./photo-add.component.css']
})
export class PhotoAddComponent implements OnInit {
  title: string = '';
  url: string = '';
  userId!: number; // Dihapus inisialisasi
  isPublic: boolean = true;
  uploadMethod: string = 'file'; // Default ke 'file'
  selectedFile: File | null = null;

  constructor(private router: Router, private photoService: PhotoService, private route: ActivatedRoute) {}

  ngOnInit() {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.userId = Number(userId);
    } else {
      console.error('User ID not found in localStorage');
      // Tindakan yang tepat jika userId tidak ditemukan, seperti mengarahkan kembali ke halaman login
    }
  }  

  // Method ini dipanggil saat user memilih file
  onFileSelected(event: any) {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
    }
  }

  // Method untuk mengunggah foto
  onSubmit(event: any) {
    event.preventDefault();

    if (this.uploadMethod === 'file' && this.selectedFile) {
      const formData = new FormData();
      formData.append('title', this.title);
      formData.append('user_id', this.userId.toString()); // Pastikan ini ada
      formData.append('is_public', this.isPublic.toString());
      formData.append('photo', this.selectedFile);

      console.log('FormData before upload:', formData); // Log FormData untuk debug

      this.photoService.uploadPhoto(formData).subscribe({
        next: (response) => {
          console.log('Upload success:', response);
          this.router.navigate(['/photo-list']); // Pindah ke daftar foto setelah berhasil
        },
        error: (error) => {
          console.error('Error uploading photo:', error);
        }
      });

    } else if (this.uploadMethod === 'url' && this.url) {
      const newPhoto: PhotoAdd = {
        user_id: this.userId,
        title: this.title,
        url: this.url,
        is_public: this.isPublic,
        uploaded_at: new Date()
      };

      this.photoService.addPhoto(newPhoto).subscribe({
        next: (response) => {
          console.log('Photo added successfully:', response);
          this.router.navigate(['/photo-list']); // Pindah ke daftar foto setelah berhasil
        },
        error: (error) => {
          console.error('Error adding photo:', error);
        }
      });
    }
  }
}
