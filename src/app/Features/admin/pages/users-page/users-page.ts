import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { UsersHeader } from '../../components/users-header/users-header';
import { UsersFilters } from '../../components/users-filters/users-filters';
import { UserCard } from '../../components/user-card/user-card';
import { UsersList } from '../../components/users-list/users-list';

@Component({
  selector: 'app-users-page',
  standalone: true,
  imports: [CommonModule, UsersHeader, UsersFilters, UserCard, UsersList],
  templateUrl: './users-page.html',
  styleUrl: './users-page.scss',
})
export class UsersPage {
  //------------------------test user Header-----------------------------------

  onAddUser() {
    console.log('open modal');
  }
  //------------------------test user Filters-----------------------------------

  onRoleChange(role: string) {
    console.log('role:', role);
  }

  onStatusChange(status: boolean) {
    console.log('isActive:', status);
  }
  //------------------------test user card-----------------------------------

  users = [
    {
      id: '1',
      name: 'Ahmed Hassan',
      email: 'ahmed@test.com',
      roleId: 'Admin',
      branchName: 'Branch 1',
      isDeleted: false,
    },
    {
      id: '2',
      name: 'Sara Mohamed',
      email: 'sara@test.com',
      roleId: 'Waiter',
      branchName: 'Branch 1',
      isDeleted: true,
    },
  ];

  onEditUser(user: any) {
    console.log('edit', user);
  }

  onToggleUser(id: string) {
    console.log('toggle', id);
  }
  //-------------------------Test user list--------------------------------------
}
