import { Component, EventEmitter, Output } from '@angular/core';
import { Subject, debounceTime, of, switchMap } from 'rxjs';
import { UsersService } from '../../../../../Core/Services/User-Service/users-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomerInterface } from '../../../../../Core/Models/UserModels/customer-interface';
import { CreateCustomerInterface } from '../../../../../Core/Models/UserModels/create-customer-interface';

@Component({
  selector: 'app-customer-search',
  imports: [CommonModule, FormsModule],
  templateUrl: './customer-search.html',
  styleUrl: './customer-search.scss',
})
export class CustomerSearch {
  @Output() select = new EventEmitter<CustomerInterface>();

  searchTerm = '';
  results: CustomerInterface[] = [];

  loading = false;
  adding = false;

  showAddForm = false;

  // 🔥 form
  newCustomerName = '';

  private searchSubject = new Subject<string>();

  constructor(private userService: UsersService) {

    this.searchSubject.pipe(
      debounceTime(400),
      switchMap(term => {
        if (!term) {
          this.results = [];
          return of({ data: [] });
        }

        this.loading = true;
        return this.userService.searchCustomers(term);
      })
    ).subscribe(res => {
      this.results = res.data;
      this.loading = false;
    });
  }

  onInput(value: string) {
    this.showAddForm = false;
    this.searchSubject.next(value);
  }

  selectCustomer(user: CustomerInterface) {
    this.select.emit(user);
    this.results = [];
    this.searchTerm = user.phoneNumber;
  }

  // 🔥 SHOW FORM
  openAddForm() {
    this.showAddForm = true;
  }

  // 🔥 CREATE CUSTOMER
  createCustomer() {

    if (!this.newCustomerName || !this.searchTerm) return;

    const dto: CreateCustomerInterface = {
      name: this.newCustomerName,
      phoneNumber: this.searchTerm
    };

    this.adding = true;

    this.userService.addCustomer(dto).subscribe((user: any) => {
      this.selectCustomer(user);
      this.adding = false;
      this.showAddForm = false;
    });
  }
}
