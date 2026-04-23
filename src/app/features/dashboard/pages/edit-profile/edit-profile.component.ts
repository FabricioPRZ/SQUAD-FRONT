import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { EditProfileViewModelService } from '../../viewmodels/edit-profile-view-model.service';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent],
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {

  showPassSection = false;
  showCurrentPass = false;
  showNewPass = false;
  showConfirmPass = false;

  constructor(public vm: EditProfileViewModelService) {}

  ngOnInit(): void {
    this.vm.init();
  }

  onAvatarSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.vm.onAvatarSelected(file);
    }
  }

  toggleCurrentPassword() { this.showCurrentPass = !this.showCurrentPass; }
  toggleNewPassword() { this.showNewPass = !this.showNewPass; }
  toggleConfirmPassword() { this.showConfirmPass = !this.showConfirmPass; }
}
