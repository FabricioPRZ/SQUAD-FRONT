import { Component } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header.component';
import { ToastComponent } from './shared/components/toast/toast.component';
import { ConfirmDialogComponent } from './shared/components/confirm-dialog/confirm-dialog.component';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, ToastComponent, ConfirmDialogComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'SQUADUP';
  isLandingPage: boolean = false;
  isDashboard: boolean = false;

  constructor(private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      const url = event.urlAfterRedirects || event.url;
      this.isLandingPage = url === '/';
      // Ocultar header global: todos los layouts de la app manejan su propio header
      this.isDashboard = url.startsWith('/dashboard') || 
                         url.startsWith('/home') || 
                         url.startsWith('/lobbys') ||
                         url.startsWith('/edit-profile') ||
                         url.startsWith('/saved-posts') ||
                         url === '/login' || 
                         url === '/register';
    });
  }
}


