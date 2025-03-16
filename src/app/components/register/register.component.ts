import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  username: string = '';
  email: string = ''; // Tambahkan properti ini
  password: string = '';
  confirmPassword: string = ''; // Tambahkan properti ini
  errorMessage: string = ''; // Tambahkan properti ini

  constructor(private http: HttpClient, private router: Router) {}

  register() {
    if (this.password !== this.confirmPassword) {
      this.errorMessage = "Passwords do not match!";
      return;
    }

    this.http.post('http://localhost:3000/register', {
      username: this.username,
      email: this.email,
      password: this.password
    }).subscribe(response => {
      console.log('User registered:', response);
      this.router.navigate(['/login']); // Arahkan ke halaman login setelah berhasil
    }, error => {
      console.error('Error registering user:', error);
      this.errorMessage = 'Registration failed! Please try again.'; // Set pesan error
    });
  }
}
