import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  users: any;
  constructor(private router: Router) { }

  login(username: string, password: string): boolean {
    if (username === 'admin' && password === 'password') {
      localStorage.setItem('token', 'loggedIn');
      this.router.navigate(['/gallery']);
      return true;
    }
    return false;
  }

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
  // Metode untuk registrasi pengguna
  register(username: string, email: string, password: string): Promise<void> {
    return new Promise((resolve, reject) => {
      // Cek jika pengguna sudah ada
      const userExists = this.users.find((user: { username: string; email: string; }) => user.username === username || user.email === email);
      if (userExists) {
        reject(new Error('Username or email already exists!'));
      } else {
        // Tambah pengguna baru
        this.users.push({ username, email, password });
        resolve();
      }
    });
  }
}

