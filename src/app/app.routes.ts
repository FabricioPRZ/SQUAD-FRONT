import { Routes } from '@angular/router';
import { LandingComponent } from './features/auth/pages/landing/landing.component';
import { LoginComponent } from './features/auth/pages/login/login.component';
import { RegisterComponent } from './features/auth/pages/register/register.component';
import { DashboardComponent } from './features/dashboard/pages/dashboard/dashboard.component';
import { CreateLobbyComponent } from './features/dashboard/pages/create-lobby/create-lobby.component';
import { HomeComponent } from './features/dashboard/pages/home/home.component';
import { LobbysComponent } from './features/dashboard/pages/lobbys/lobbys.component';
import { EditProfileComponent } from './features/dashboard/pages/edit-profile/edit-profile.component';
import { SavedPostsComponent } from './features/dashboard/pages/saved-posts/saved-posts.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // Rutas protegidas — requieren sesión activa
  { path: 'dashboard', component: DashboardComponent, /*canActivate: [authGuard] */ },
  { path: 'dashboard/groups/create', component: CreateLobbyComponent, /*canActivate: [authGuard] */ },
  { path: 'dashboard/groups/:id/edit', component: CreateLobbyComponent, /*canActivate: [authGuard] */ },
  { path: 'home', component: HomeComponent, /*canActivate: [authGuard] */ },
  { path: 'lobbys', component: LobbysComponent, /*canActivate: [authGuard] */ },
  { path: 'edit-profile', component: EditProfileComponent, /*canActivate: [authGuard] */ },
  { path: 'saved-posts', component: SavedPostsComponent, /*canActivate: [authGuard] */ },

  { path: '**', redirectTo: '' }
];
