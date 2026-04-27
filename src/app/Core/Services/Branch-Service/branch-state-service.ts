import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { BranchService } from '../Branch-Service/branch-service';
import { BranchDto } from '../../Models/BranchModels/Branch-dto';

@Injectable({
    providedIn: 'root'
})
export class BranchStateService {

    private branchesSource = new BehaviorSubject<BranchDto[]>([]);
    branches$ = this.branchesSource.asObservable();

    private selectedBranchSource = new BehaviorSubject<BranchDto | null>(null);
    selectedBranch$ = this.selectedBranchSource.asObservable();

    constructor(private branchService: BranchService) { }

    loadBranches() {
        this.branchService.getBranches().subscribe({
            next: (branches) => {

                
                const active = branches.filter(b => b.isActive);

                this.branchesSource.next(active);

                const saved = localStorage.getItem('selected_branch');

                if (saved) {
                    const branch = active.find(b => b.id === +saved);
                    if (branch) {
                        this.selectedBranchSource.next(branch);
                        return;
                    }
                }

                if (active.length > 0) {
                    this.selectBranch(active[0]);
                }
            }
        });
    }

    selectBranch(branch: BranchDto) {
        this.selectedBranchSource.next(branch);
        localStorage.setItem('selected_branch', branch.id.toString());
    }

    getCurrentBranchId(): number | null {
        return this.selectedBranchSource.value?.id ?? null;
    }
}