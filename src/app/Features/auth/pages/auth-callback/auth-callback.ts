import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-auth-callback',
  imports: [TranslatePipe],
  templateUrl: './auth-callback.html',
  styleUrl: './auth-callback.scss',
})
export class AuthCallback {
  
  constructor(private router: Router) {}

  ngOnInit() {
    // هنا cookies already set من الباك
    setTimeout(() => {
      this.router.navigate(['/']);
    }, 1000);
  }
}
