import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})


export class Navbar {
   isDropdownOpen = false;
  isMobileMenuOpen = false;

   constructor(private router: Router) {}

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }
onLogout(): void {
  const confirmLogout = confirm('Are you sure you want to logout?');

  if (confirmLogout) {
    console.log('User confirmed logout.');
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    this.router.navigate(['/']); // ✅ redirect only here
  } else {
    console.log('User cancelled logout.');
    // Do not redirect, do not clear token
  }
}


  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }

  // Close dropdown when clicking outside
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.dropdown')) {
      this.isDropdownOpen = false;
    }
  }
}
