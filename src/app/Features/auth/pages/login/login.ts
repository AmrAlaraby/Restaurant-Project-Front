import { Component } from '@angular/core';
import { LoginRequestInterface } from '../../../../Core/Models/AuthModels/login-request-interface';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../../Core/Services/Auth-Service/auth-service';
import { Router, RouterLink } from '@angular/router';

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
    private router: Router
  ) {}



ngOnInit(): void {
  this.loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
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
      password: this.f['password'].value!
    };

    this.authService.login(data).subscribe({
      next: (res) => {
        this.isSubmitting = false;
        this.router.navigate(['/']);
        console.log("done");
        console.log(res);
        
        
      },
      error: (err) => {
        this.isSubmitting = false;
        this.serverError = err?.error?.message || 'Login failed';
      }
    });
  }
  togglePassword() {
  this.showPassword = !this.showPassword;
}

loginWithGoogle() {
  window.location.href =
    'https://localhost:7232/api/Auth/external-login?provider=Google';
}

loginWithFacebook() {
  window.location.href =
    'https://localhost:7232/api/Auth/external-login?provider=Facebook';
}
}
