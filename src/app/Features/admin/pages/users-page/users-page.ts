import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UsersHeader } from '../../components/users-header/users-header';
import { UsersFilters } from '../../components/users-filters/users-filters';
import { UserCard } from '../../components/user-card/user-card';
import { UsersList } from '../../components/users-list/users-list';
import { UsersService } from '../../../../Core/Services/users-service';
import { User } from '../../../../Core/Models/UserModels/user';
import { Pagination } from '../../../../Shared/Components/pagination/pagination';
import { UserModal } from '../../components/user-modal/user-modal';

@Component({
  selector: 'app-users-page',
  standalone: true,
  imports: [CommonModule, UsersHeader, UsersFilters, UserCard, UsersList, Pagination, UserModal],
  templateUrl: './users-page.html',
  styleUrl: './users-page.scss',
})
export class UsersPage implements OnInit {
  constructor(private usersService: UsersService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  users: User[] = [];
  pageIndex = 1;
  pageSize = 5;
  totalCount = 0;
  selectedRole = 'All';
  isActive = true;
  // ---------------------------- Load Users -----------------------------------
  loadUsers() {
    const params = {
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
      roleId: this.selectedRole,
    };

    if (this.isActive) {
      this.usersService.getUsers(params).subscribe((res) => {
        this.users = res.data;
        this.totalCount = res.count;
      });
    } else {
      this.usersService.getInactiveUsers(params).subscribe((res) => {
        this.users = res.data;
        this.totalCount = res.count;
      });
    }
  }
  // //------------------------test user Header---------------------------

  // onAddUser() {
  //   console.log('open modal');
  // }
  //------------------------Role Filter-----------------------------------
  onRoleChange(role: string) {
    this.selectedRole = role;

    this.pageIndex = 1;

    this.loadUsers();
  }
  //------------------------Status Filter-----------------------------------
  onStatusChange(status: boolean) {
    this.isActive = status;

    this.pageIndex = 1;

    this.loadUsers();
  }
  //------------------------test user card-----------------------------------

  onEditUser(user: any) {
    console.log('edit', user);
  }
  // ------------------------Toggle User Status-----------------------------------
  onToggleUser(id: string) {
    const user = this.users.find((u) => u.id === id);
    if (!user) return;
    user.isDeleted = !user.isDeleted;
    this.usersService.toggleUser(id).subscribe({
      next: () => {
        console.log('toggle success');
      },
      error: () => {
        console.log('toggle failed');
        user.isDeleted = !user.isDeleted;
      },
    });
  }
  //-------------------------When page changes-----------------------------------
  onPageChange(page: number) {
    this.pageIndex = page;
    this.loadUsers();
  }
//------------------------- Add User Modal-----------------------------------
  showModal = false;

  onAddUser() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }
}
