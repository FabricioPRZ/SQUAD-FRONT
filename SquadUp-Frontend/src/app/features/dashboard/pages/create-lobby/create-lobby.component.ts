import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { CreateLobbyViewModelService } from '../../../../features/lobbys/viewmodels/create-lobby-view-model.service';
import { LobbyPrivacy } from '../../../../features/lobbys/models/lobby-request';

@Component({
  selector: 'app-create-lobby',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent],
  templateUrl: './create-lobby.component.html',
  styleUrls: ['./create-lobby.component.css']
})
export class CreateLobbyComponent implements OnInit {

  availableTags = ['Competitivo', 'Amistoso', 'Casual', 'Ranked', 'Práctica', 'Cross-Platform', 'Roleplay', 'Speedrunning'];

  constructor(
    public vm: CreateLobbyViewModelService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.vm.reset();
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.vm.loadLobbyForEdit(Number(idParam));
    }
  }

  onImageSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        this.vm.setImageUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  togglePrivacy() {
    const current = this.vm.privacy();
    this.vm.setPrivacy(current === 'PUBLIC' ? 'PRIVATE' : 'PUBLIC');
  }

  toggleTag(tag: string) {
    this.vm.toggleTag(tag);
  }

  clampMembers(event: Event) {
    const input = event.target as HTMLInputElement;
    let val = Number(input.value);
    if (val < 2 || isNaN(val)) {
      val = 2;
    } else if (val > 500) {
      val = 500;
    }
    val = Math.floor(val);
    this.vm.setMaxMembers(val);
    input.value = val.toString();
  }

  incrementMembers() { 
    if (this.vm.maxMembers() < 500) this.vm.setMaxMembers(this.vm.maxMembers() + 1); 
  }
  
  decrementMembers() { 
    if (this.vm.maxMembers() > 2) this.vm.setMaxMembers(this.vm.maxMembers() - 1); 
  }

  cancel() { 
    this.vm.reset();
    this.router.navigate(['/lobbys']); 
  }

  onSubmit() {
    this.vm.submit();
  }
}
