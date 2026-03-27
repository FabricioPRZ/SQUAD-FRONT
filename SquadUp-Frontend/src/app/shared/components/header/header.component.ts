import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NotificationsModalComponent } from '../notifications-modal/notifications-modal.component';
import { UserMenuModalComponent } from '../user-menu-modal/user-menu-modal.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, NotificationsModalComponent, UserMenuModalComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  @Input() isMinimal: boolean = false;
  
  // Búsqueda
  searchQuery: string = '';

  // Estado de los modales
  showNotifications: boolean = false;
  showUserMenu: boolean = false;

  // Datos del usuario (en el futuro vendrán del servicio de auth)
  userAvatarUrl: string = 'https://i.pravatar.cc/150?img=12';
  userName: string = 'Fernando';
  userEmail: string = '233373@ids.upchiapas.edu.mx';

  // Notificaciones (badge)
  get notificationCount(): number {
    return 3;
  }

  get hasNotifications(): boolean {
    return this.notificationCount > 0;
  }

  // Búsqueda
  onSearch(): void {
    if (this.searchQuery.trim()) {
      console.log('Buscando:', this.searchQuery);
    }
  }

  // Toggle notificaciones
  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
    if (this.showNotifications) {
      this.showUserMenu = false; // Cierra el otro modal
    }
  }

  // Toggle menú de usuario
  toggleUserMenu(): void {
    this.showUserMenu = !this.showUserMenu;
    if (this.showUserMenu) {
      this.showNotifications = false; // Cierra el otro modal
    }
  }

  // Cerrar modales
  closeNotifications(): void {
    this.showNotifications = false;
  }

  closeUserMenu(): void {
    this.showUserMenu = false;
  }

  // Acción de logout
  onLogout(): void {
    console.log('Cerrar sesión');
    this.showUserMenu = false;
  }

  // Opción del menú seleccionada
  onMenuOption(optionId: string): void {
    console.log('Opción seleccionada:', optionId);
  }
}
