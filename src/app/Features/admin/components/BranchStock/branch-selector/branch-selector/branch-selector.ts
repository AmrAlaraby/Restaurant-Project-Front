import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BranchService } from '../../../../../../Core/Services/Branch-Service/branch-service';

@Component({
  selector: 'app-branch-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './branch-selector.html',
  styleUrls: ['./branch-selector.scss']
})
export class BranchSelectorComponent implements OnInit {

  branches: any[] = [];
  selectedBranchId: number | null = null;

  @Output() branchChanged = new EventEmitter<number>();

  constructor(private branchService: BranchService) {}

  ngOnInit(): void {
    this.branchService.getBranches().subscribe(res => {
      this.branches = res;
    });
  }

  selectBranch(id: number) {
    this.selectedBranchId = id;
    this.branchChanged.emit(id);
  }
}