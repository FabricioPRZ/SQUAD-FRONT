import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent {
  // Información de ejemplo para la zona scrolleable
  features = [
    {
      title: 'Compite al máximo',
      description: 'Únete a lobbys personalizados y demuestra tus habilidades en SquadUp.',
      icon: '🏆'
    },
    {
      title: 'Comunidad Gamer',
      description: 'Conéctate con otros jugadores, comparte estrategias y forma el equipo perfecto.',
      icon: '🎮'
    },
    {
      title: 'Torneos Exclusivos',
      description: 'Participa en eventos organizados y gana premios increíbles cada semana.',
      icon: '🔥'
    }
  ];
}
