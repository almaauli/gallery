import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {
  showNavbar = true;

  constructor(private router: Router) {
    // Listen to route changes
    this.router.events.subscribe(() => {
      this.checkRoute();
    });
  }

  ngOnInit(): void {
    this.checkRoute(); // Initial route check when the component is loaded
  }

  checkRoute() {
    const currentRoute = this.router.url;
    // Hide navbar on login or register routes
    if (currentRoute === '/login' || currentRoute === '/register') {
      this.showNavbar = false;
    } else {
      this.showNavbar = true;
    }
  }
  confirmLogout() {
    const confirmation = confirm('Anda yakin ingin log out?');
    if (confirmation) {
      // Navigasi ke halaman login
      this.router.navigate(['/login']);
    }
  }
}