import { Component } from '@angular/core';
import { showConfirmDialog } from '../utils/sweetalert';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';




interface NavItem {
  icon: string;
  label: string;
  badge?: number;
  badgeColor?: string;
  active?: boolean;
  href?: string;
  route?: string; // Use for Angular routing
}

interface NavSection {
  title: string;
  items: NavItem[];
}

interface Role {
  nom: string;

}

interface User {
  name: string ; 
  role : Role ; 
}
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule,FormsModule],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css']
})
export class Sidebar {
   // Sidebar state
  isSidebarOpen = false;
  
  // Search functionality
  searchQuery = '';
  filteredSections: NavSection[] = [];
  
  // User data
  user = {
    name: '',
    role: '',
    
  };
  
  // Dark mode
  isDarkMode = false;
  
  // Navigation sections
  navSections: NavSection[] = [
    {
      title: 'MAIN',
      items: [
        { icon: 'bi-speedometer2', label: 'Dashboard', route :'/loggedin/home'},
        { icon: "bi bi-gear-fill", label: 'Roles'  , route: '/loggedin/roles' },
        { icon: 'bi-people', label: 'Users', route: '/loggedin/users' },
        { icon: 'bi-patch-check', label: 'Badges' , route : '/loggedin/badges'},
        { icon: 'bi-person-workspace', label: 'Employees' , route : '/loggedin/employees' },
        { icon: 'bi-person-plus', label: 'Visitors'  , route : '/loggedin/visitors'},

      ]
    },
    /*{
      title: 'MANAGEMENT',
      items: [
        //{ icon: 'bi-folder', label: 'Projects' },
        //{ icon: 'bi-calendar-event', label: 'Calendar' },
        //{ icon: 'bi-chat-dots', label: 'Messages', badge: 3, badgeColor: 'warning' },
        //{ icon: 'bi-bell', label: 'Notifications' }
      ]
    },*/
    {
      title: 'SETTINGS',
      items: [
        { icon: 'bi-person-circle', label: 'Profile', route : '/loggedin/profile' },
      ]
    }
  ];
  
  constructor(private http: HttpClient) {
    this.filteredSections = [...this.navSections];
  }
  
  ngOnInit(): void {
    // Load dark mode preference
    this.isDarkMode = localStorage.getItem('darkMode') === 'true';
    this.applyDarkMode();
    
    // Initialize Bootstrap components
    this.initializeBootstrap();

     this.http.get<any>('http://localhost:8080/users/me').subscribe({
    next: data => {
      this.user.name = data.firstName + ' ' + data.lastName;
      this.user.role = data.role.nom;
    },
    error: err => {
      console.error('Failed to fetch user:', err);
    }
  });


  }
  
  ngOnDestroy(): void {
    // Cleanup if needed
  }
  
  // Sidebar toggle
  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
    
    if (this.isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }
  
  closeSidebar(): void {
    this.isSidebarOpen = false;
    document.body.style.overflow = 'auto';
  }
  
  // Navigation
  navigateToItem(item: NavItem): void {
    // Remove active state from all items
    this.navSections.forEach(section => {
      section.items.forEach(navItem => {
        navItem.active = false;
      });
       this.closeSidebar();
    });
    
    // Set active state for clicked item
    item.active = true;
    
    // Log navigation
    console.log('Navigating to:', item.label);
    
    // Here you would typically use Angular Router
    // this.router.navigate([item.href || '/' + item.label.toLowerCase()]);
    
    // Close sidebar on mobile
    if (window.innerWidth < 768) {
      this.closeSidebar();
    }
  }
  
  // Search functionality
  onSearchChange(): void {
    if (!this.searchQuery.trim()) {
      this.filteredSections = [...this.navSections];
      return;
    }
    
    const query = this.searchQuery.toLowerCase();
    this.filteredSections = this.navSections.map(section => ({
      ...section,
      items: section.items.filter(item => 
        item.label.toLowerCase().includes(query)
      )
    })).filter(section => section.items.length > 0);
  }
  
  clearSearch(): void {
    this.searchQuery = '';
    this.onSearchChange();
  }
  
  // Dark mode toggle
  toggleDarkMode(): void {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('darkMode', this.isDarkMode.toString());
    this.applyDarkMode();
  }
  
  private applyDarkMode(): void {
    if (this.isDarkMode) {
      document.body.setAttribute('data-bs-theme', 'dark');
      document.body.classList.add('dark-mode');
    } else {
      document.body.removeAttribute('data-bs-theme');
      document.body.classList.remove('dark-mode');
    }
  }
  
  // User actions
  onProfileClick(): void {
    console.log('Profile clicked');
    // Navigate to profile page
  }
  
  onSettingsClick(): void {
    console.log('Settings clicked');
    // Navigate to settings page
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
      console.log('User logging out...');
      // Clear user session
      localStorage.removeItem('token');
      localStorage.removeItem('userData');
      // Redirect to login
      // this.router.navigate(['/login']);
    }
  }
  
  // Upgrade action
  onUpgradeClick(): void {
    console.log('Upgrade to Pro clicked');
    // Handle upgrade logic
  }
  
  // Notification actions
  onNotificationClick(): void {
    console.log('Notifications clicked');
    // Show notifications panel or navigate to notifications page
  }
  
  // Badge management
  updateBadge(sectionTitle: string, itemLabel: string, count: number): void {
    const section = this.navSections.find(s => s.title === sectionTitle);
    if (section) {
      const item = section.items.find(i => i.label === itemLabel);
      if (item) {
        item.badge = count > 0 ? count : undefined;
      }
    }
  }
  
  // Keyboard shortcuts
  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    // Ctrl/Cmd + B to toggle sidebar
    if ((event.ctrlKey || event.metaKey) && event.key === 'b') {
      event.preventDefault();
      this.toggleSidebar();
    }
    
    // Escape to close sidebar
    if (event.key === 'Escape' && this.isSidebarOpen) {
      this.closeSidebar();
    }
  }
  
  // Window resize handler
  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    if (event.target.innerWidth >= 768 && this.isSidebarOpen) {
      // Auto-close sidebar on desktop resize
      this.closeSidebar();
    }
  }
  
  // Initialize Bootstrap components
  private initializeBootstrap(): void {
    // This would be called after view init in a real app
    setTimeout(() => {
      // Initialize any Bootstrap components that need JS
      // Example: tooltips, popovers, etc.
    }, 100);
  }
  
  // Utility methods
  getBadgeClass(color?: string): string {
    return `badge bg-${color || 'primary'} rounded-pill ms-auto`;
  }
  
  getNavLinkClass(item: NavItem): string {
    return `nav-link ${item.active ? 'active' : ''}`;
  }
  
  // Analytics tracking
  trackUserInteraction(action: string, item: string): void {
    console.log(`User interaction: ${action} on ${item}`);
    // Send to analytics service
  }
  
  // Show notification
  showNotification(message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info'): void {
    // This would integrate with a notification service
    console.log(`${type.toUpperCase()}: ${message}`);
  }

  
}

