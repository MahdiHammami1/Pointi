import { Component } from '@angular/core';
import { showConfirmDialog } from '../utils/sweetalert';
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

async onLogout(): Promise<void> {
  const confirmed = await showConfirmDialog({
    title: 'Déconnexion',
    text: 'Êtes-vous sûr de vouloir vous déconnecter ?',
    icon: 'warning',
    confirmButtonText: 'Oui, déconnecter',
    cancelButtonText: 'Annuler'
  });
  if (confirmed) {
    console.log('User confirmed logout.');
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    this.router.navigate(['/']);
  } else {
    console.log('User cancelled logout.');
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
