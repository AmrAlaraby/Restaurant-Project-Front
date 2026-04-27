import { Component } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { BranchDto } from '../../../../Core/Models/BranchModels/Branch-dto';
import { BranchStateService } from '../../../../Core/Services/Branch-Service/branch-state-service';

@Component({
  selector: 'app-branch-selector',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './branch-selector.html',
  styleUrl: './branch-selector.scss'
})
export class BranchSelector {

  branches$!: Observable<BranchDto[]>;
  selected$!: Observable<BranchDto | null>;

  isOpen = false;

  constructor(private branchState: BranchStateService) { }

  ngOnInit() {
    this.branches$ = this.branchState.branches$;
    this.selected$ = this.branchState.selectedBranch$;
  }

  toggle() {
    this.isOpen = !this.isOpen;
  }

  select(branch: BranchDto) {
    this.branchState.selectBranch(branch);
    this.isOpen = false;

  
  }
}