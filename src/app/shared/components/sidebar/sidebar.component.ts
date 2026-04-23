import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SidebarViewModelService } from '../../viewmodels/sidebar-view-model.service';

export interface Group {
  id: string;
  name: string;
  imageUrl: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  @Output() groupSelected = new EventEmitter<Group>();

  activeGroupId: string | null = null;

  constructor(public vm: SidebarViewModelService) {}

  ngOnInit(): void {
    this.vm.loadGroups();
  }

  selectGroup(group: Group) {
    if (this.activeGroupId === group.id) {
      this.activeGroupId = null;
      this.groupSelected.emit({ id: '', name: '', imageUrl: '' });
    } else {
      this.activeGroupId = group.id;
      this.groupSelected.emit(group);
    }
  }

  onCreateGroup() {
    this.vm.navigateToCreateGroup();
  }
}
