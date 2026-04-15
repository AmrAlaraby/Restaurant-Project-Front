import { Component, EventEmitter, Output } from '@angular/core';
import { Subject, debounceTime, of, switchMap } from 'rxjs';
import { UsersService } from '../../../../../Core/Services/User-Service/users-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CustomerInterface } from '../../../../../Core/Models/UserModels/customer-interface';

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

  private searchSubject = new Subject<string>();

  constructor(private userService: UsersService) {

    this.searchSubject.pipe(
  debounceTime(400),
  switchMap(term => {
    if (!term) {
  this.loading = false;
  return of({ data: [] });
}
    this.loading = true;
    return this.userService.searchCustomers(term);
  })
).subscribe(res => {
  this.results = res?.data || [];
  this.loading = false;
});
  }

  onInput(value: string) {
    this.searchSubject.next(value);
  }

  selectCustomer(user: CustomerInterface) {
  this.select.emit(user);
  this.results = [];
  this.searchTerm = user.phoneNumber;
}
}
