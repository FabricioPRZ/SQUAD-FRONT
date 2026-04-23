import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { CreateLobbyViewModelService } from '../../../../features/lobbys/viewmodels/create-lobby-view-model.service';

@Component({
  selector: 'app-create-lobby',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent],
  templateUrl: './create-lobby.component.html',
  styleUrls: ['./create-lobby.component.css']
})
export class CreateLobbyComponent implements OnInit {

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
    if (file) this.vm.setImageFile(file);
  }

  cancel() {
    this.vm.reset();
    this.router.navigate(['/lobbys']);
  }

  onSubmit() { this.vm.submit(); }
}