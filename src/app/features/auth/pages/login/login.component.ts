import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginData = {
    email: '',
    password: ''
  };

  showPassword = false;

  // Credenciales de prueba
  private readonly MOCK_USER = {
    email: 'test@squadup.com',
    password: 'password123'
  };

  constructor(private router: Router) {}

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }


  onSubmit() {
    console.log('Intento de login:', this.loginData);
    
    if (this.loginData.email === this.MOCK_USER.email && 
        this.loginData.password === this.MOCK_USER.password) {
      alert('¡Bienvenido a SQUADUP!');
      this.router.navigate(['/home']);
    } else {
      alert('Credenciales incorrectas. Usa: test@squadup.com / password123');
    }
  }
}
