import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { LobbyService } from '../../../../shared/services/lobby.service';
import { ToastService } from '../../../../shared/services/toast.service';
import { ConfirmService } from '../../../../shared/services/confirm.service';

@Component({
  selector: 'app-create-lobby',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent],
  templateUrl: './create-lobby.component.html',
  styleUrls: ['./create-lobby.component.css']
})
export class CreateLobbyComponent implements OnInit {

  isEditMode = false;
  editLobbyId: number | null = null;
  loading = false;

  lobbyData = {
    name: '',
    description: '',
    image: null as string | null,
    privacy: 'PUBLIC' as 'PUBLIC' | 'PRIVATE',
    lobbyType: 'CASUAL' as string,
    maxMembers: 4,
    tags: ['Competitivo'] as string[]
  };

  availableTags = ['Competitivo', 'Amistoso', 'Casual', 'Ranked', 'Práctica', 'Cross-Platform', 'Roleplay', 'Speedrunning'];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private lobbyService: LobbyService,
    private toast: ToastService,
    private confirm: ConfirmService
  ) {}

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode = true;
      this.editLobbyId = Number(idParam);
      // Carga el lobby para editar
      this.lobbyService.getMyLobbies().subscribe({
        next: (lobbies) => {
          const lobby = lobbies.find(l => l.id === this.editLobbyId);
          if (lobby) {
            this.lobbyData = {
              name: lobby.name,
              description: lobby.description,
              image: lobby.imageUrl || null,
              privacy: (lobby.privacy as 'PUBLIC' | 'PRIVATE') ?? 'PUBLIC',
              lobbyType: lobby.lobbyType ?? 'CASUAL',
              maxMembers: lobby.maxMembers,
              tags: [...(lobby.tags || [])]
            };
          }
        },
        error: () => this.toast.error('Error', 'No se pudo cargar el lobby.')
      });
    }
  }

  onImageSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        this.lobbyData.image = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  togglePrivacy() {
    this.lobbyData.privacy = this.lobbyData.privacy === 'PUBLIC' ? 'PRIVATE' : 'PUBLIC';
  }

  toggleTag(tag: string) {
    if (this.lobbyData.tags.includes(tag)) {
      this.lobbyData.tags = this.lobbyData.tags.filter(t => t !== tag);
    } else {
      this.lobbyData.tags.push(tag);
    }
  }

  clampMembers() {
    if (this.lobbyData.maxMembers < 2 || isNaN(this.lobbyData.maxMembers)) {
      this.lobbyData.maxMembers = 2;
    } else if (this.lobbyData.maxMembers > 500) {
      this.lobbyData.maxMembers = 500;
    }
    this.lobbyData.maxMembers = Math.floor(this.lobbyData.maxMembers);
  }

  incrementMembers() { if (this.lobbyData.maxMembers < 500) this.lobbyData.maxMembers++; }
  decrementMembers() { if (this.lobbyData.maxMembers > 2) this.lobbyData.maxMembers--; }

  cancel() { this.router.navigate(['/lobbys']); }

  async onSubmit() {
    if (!this.lobbyData.name.trim()) {
      this.toast.error('Falta el nombre', 'El lobby debe tener un nombre.');
      return;
    }

    const req = {
      name: this.lobbyData.name,
      description: this.lobbyData.description,
      privacy: this.lobbyData.privacy,
      lobbyType: this.lobbyData.lobbyType,
      maxMembers: this.lobbyData.maxMembers as unknown as number,
      tags: this.lobbyData.tags
    };

    if (this.isEditMode && this.editLobbyId) {
      const ok = await this.confirm.open({
        title: '¿Guardar cambios?',
        message: `Se actualizará la información de "${this.lobbyData.name}".`,
        confirmText: 'Guardar',
        cancelText: 'Seguir editando',
        type: 'success'
      });
      if (!ok) return;

      this.loading = true;
      this.lobbyService.update(this.editLobbyId, req).subscribe({
        next: () => {
          this.loading = false;
          this.toast.success('Lobby actualizado', `Los cambios en "${req.name}" se guardaron.`);
          setTimeout(() => this.router.navigate(['/lobbys']), 1000);
        },
        error: (err) => {
          this.loading = false;
          this.toast.error('Error', err?.error?.message || 'No se pudo actualizar el lobby.');
        }
      });
    } else {
      this.loading = true;
      this.lobbyService.create(req).subscribe({
        next: () => {
          this.loading = false;
          this.toast.success('Lobby creado', `"${req.name}" fue creado con éxito.`);
          setTimeout(() => this.router.navigate(['/lobbys']), 1000);
        },
        error: (err) => {
          this.loading = false;
          this.toast.error('Error', err?.error?.message || 'No se pudo crear el lobby.');
        }
      });
    }
  }
}
