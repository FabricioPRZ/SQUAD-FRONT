import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LoginViewModelService } from '../../viewmodels/login-view-model.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  showPassword = false;

  constructor(public vm: LoginViewModelService) {}

  togglePasswordVisibility() { this.showPassword = !this.showPassword; }

  onSubmit() { this.vm.login(); }
}