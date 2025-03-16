import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { LoginResponse } from '../../models/login-response.model'; // Import model

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = ''; // Tambahkan properti untuk menampilkan pesan kesalahan

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit() {
    this.http.post<LoginResponse>('http://localhost:3000/login', {
      username: this.username,
      password: this.password
    }).subscribe(
      response => {
        console.log('User logged in:', response);
        localStorage.setItem('userId', response.userId.toString()); // Simpan userId di local storage
        localStorage.setItem('username', this.username); // Simpan username di local storage
        alert(`Anda berhasil login sebagai ${this.username}`); // Tampilkan notifikasi sederhana
        
        // Arahkan ke halaman daftar foto berdasarkan userId
        this.router.navigate([`/photo-list`]); // Arahkan ke halaman photo-list
      }, 
      error => {
        console.error('Error logging in user:', error);
        this.errorMessage = 'Login gagal. Silakan periksa kredensial Anda.'; // Set pesan kesalahan jika login gagal
      }
    );
  }
}
