import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BranchListComponent } from '../../components/Branch/branch-list/branch-list';
import { BranchDetailsComponent } from '../../components/Branch/branch-details/branch-details';
import { BranchEditComponent } from '../../components/Branch/branch-edit/branch-edit';
import { BranchCreateComponent } from '../../components/Branch/branch-create/branch-create';

@Component({
  selector: 'app-branch-page',
  standalone: true,
  imports: [CommonModule, RouterModule, BranchListComponent, BranchDetailsComponent, BranchEditComponent, BranchCreateComponent],
  templateUrl: './branch-page.html',
  styleUrls: ['./branch-page.scss'],
})
export class BranchPageComponent {
  selectedBranchId = signal<number | null>(null);
  activeView = signal<'details' | 'edit' | 'create' | null>(null);
  refreshTrigger = signal(0);

  showPanel = computed(() => this.activeView() !== null);

  onBranchSelected(id: number): void {
    this.selectedBranchId.set(id);
    this.activeView.set('details');
  }

  onCloseDetails(): void {
    this.selectedBranchId.set(null);
    this.activeView.set(null);
  }

  onEditRequested(): void {
    this.activeView.set('edit');
  }

  onCloseEdit(): void {
    this.activeView.set('details');
  }

  onBranchSaved(): void {
    this.activeView.set('details');
    this.refreshTrigger.update(v => v + 1); // ← refresh الليست
  }

  onCreateRequested(): void {
    this.selectedBranchId.set(null);
    this.activeView.set('create');
  }

  onCloseCreate(): void {
    this.activeView.set(null);
  }

  onBranchCreated(): void {
    this.activeView.set(null);
    this.refreshTrigger.update(v => v + 1);
  }

  onBranchDeleted(): void {
    this.selectedBranchId.set(null);
    this.activeView.set(null);
    this.refreshTrigger.update(v => v + 1);
  }
}
