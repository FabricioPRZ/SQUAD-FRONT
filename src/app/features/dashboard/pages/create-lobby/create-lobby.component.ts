import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { LobbyService, Member } from '../../../../shared/services/lobby.service';
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
  editLobbyId: string | null = null;
  members: Member[] = [];

  lobbyData = {
    name: '',
    description: '',
    image: null as string | null,
    isPrivate: false,
    maxPlayers: 4,
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
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.editLobbyId = id;
      const lobby = this.lobbyService.getById(id);
      if (lobby) {
        this.lobbyData = {
          name: lobby.name,
          description: lobby.description,
          image: lobby.imageUrl || null,
          isPrivate: false,
          maxPlayers: lobby.maxPlayers,
          tags: [...lobby.tags]
        };
        this.members = this.lobbyService.getSortedMembers(id);
      }
    }
  }

  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => { this.lobbyData.image = e.target.result; };
      reader.readAsDataURL(file);
    }
  }

  togglePrivacy() { this.lobbyData.isPrivate = !this.lobbyData.isPrivate; }

  toggleTag(tag: string) {
    if (this.lobbyData.tags.includes(tag)) {
      this.lobbyData.tags = this.lobbyData.tags.filter(t => t !== tag);
    } else {
      this.lobbyData.tags.push(tag);
    }
  }

  clampPlayers() {
    if (this.lobbyData.maxPlayers < 1 || isNaN(this.lobbyData.maxPlayers)) {
      this.lobbyData.maxPlayers = 1;
    } else if (this.lobbyData.maxPlayers > 9999) {
      this.lobbyData.maxPlayers = 9999;
    }
    this.lobbyData.maxPlayers = Math.floor(this.lobbyData.maxPlayers);
  }

  incrementPlayers() { if (this.lobbyData.maxPlayers < 9999) this.lobbyData.maxPlayers++; }
  decrementPlayers() { if (this.lobbyData.maxPlayers > 1) this.lobbyData.maxPlayers--; }

  async kickMember(member: Member) {
    if (member.role === 'owner') return;
    const ok = await this.confirm.open({
      title: '¿Expulsar usuario?',
      message: `¿Estás seguro de que quieres expulsar a "${member.nickname}" del lobby? Esta acción no se puede deshacer.`,
      confirmText: 'Sí, expulsar',
      cancelText: 'Cancelar',
      type: 'danger'
    });
    if (ok) {
      this.members = this.members.filter(m => m.id !== member.id);
      this.toast.warning('Usuario expulsado', `${member.nickname} fue removido del lobby.`);
    }
  }

  cancel() { this.router.navigate(['/lobbys']); }

  async onSubmit() {
    if (!this.lobbyData.name.trim()) {
      this.toast.error('Falta el nombre', 'El lobby debe tener un nombre.');
      return;
    }

    if (this.isEditMode && this.editLobbyId) {
      const ok = await this.confirm.open({
        title: '¿Guardar cambios?',
        message: `Se actualizará la información de "${this.lobbyData.name}".`,
        confirmText: 'Guardar',
        cancelText: 'Seguir editando',
        type: 'success'
      });
      if (!ok) return;

      this.lobbyService.update(this.editLobbyId, {
        name: this.lobbyData.name,
        description: this.lobbyData.description,
        imageUrl: this.lobbyData.image || '',
        maxPlayers: this.lobbyData.maxPlayers,
        tags: this.lobbyData.tags
      });
      this.toast.success('Lobby actualizado', `Los cambios en "${this.lobbyData.name}" se guardaron correctamente.`);
    } else {
      this.toast.success('Lobby creado', `"${this.lobbyData.name}" fue creado con éxito.`);
    }

    setTimeout(() => this.router.navigate(['/lobbys']), 1000);
  }

  isAlphaFirst(nickname: string): boolean {
    return /[a-zA-Z]/.test(nickname.charAt(0));
  }
}
