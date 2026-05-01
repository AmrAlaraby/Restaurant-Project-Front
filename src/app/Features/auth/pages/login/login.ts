import { Component } from '@angular/core';
import { LoginRequestInterface } from '../../../../Core/Models/AuthModels/login-request-interface';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../../Core/Services/Auth-Service/auth-service';
import { Router, RouterLink } from '@angular/router';
import { environment } from '../../../../../environments/environment.development';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  isSubmitting = false;
  serverError: string | null = null;
  loginForm!: FormGroup;
  showPassword: boolean = false;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  submit(): void {
    this.serverError = null;

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    const data: LoginRequestInterface = {
      email: this.f['email'].value!,
      password: this.f['password'].value!,
    };

    this.authService.login(data).subscribe({
      next: (res) => {
        this.isSubmitting = false;
        debugger;
        switch (res.data?.roleId?.toLowerCase()) {
          case 'admin': // Admin
            this.router.navigate(['/admin/dashboard']);
            break;
          case 'waiter': // Waiter
            this.router.navigate(['/waiter/home']);
            break;
          case 'cashier': // Cashier
            this.router.navigate(['/cashier/home']);
            break;
          case 'chef': // Chef
            this.router.navigate(['/chief/kitchen']);
            break;
          case 'driver': // Driver
            this.router.navigate(['/driver/home']);
            break;
          case 'customer': // Customer
            this.router.navigate(['/customer/home']);
            break;
          default:
            this.router.navigate(['/']);
        }
        // this.router.navigate(['/']);
        console.log('done');
        console.log(res);
      },
      error: (err) => {
        this.isSubmitting = false;
        this.serverError = err?.error?.message || 'Login failed';
      },
    });
  }
  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  loginWithGoogle() {
    window.location.href = environment.apiUrl + '/Auth/external-login?provider=Google';
  }

  loginWithFacebook() {
    window.location.href = environment.apiUrl + '/Auth/external-login?provider=Facebook';
  }
}
