import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SessionViewModelService } from '../../viewmodels/session-view-model.service';

@Component({
  selector: 'app-user-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './user-sidebar.component.html',
  styleUrls: ['./user-sidebar.component.css']
})
export class UserSidebarComponent implements OnInit {
  @Output() optionSelected = new EventEmitter<string>();

  constructor(public session: SessionViewModelService) {}

  ngOnInit() {
    this.session.loadSession();
  }

  selectOption(id: string) {
    this.optionSelected.emit(id);
  }
}
