import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../Core/Services/Auth-Service/auth-service';
import { RegisterationRequestInterface } from '../../../../Core/Models/AuthModels/registeration-request-interface';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  registerForm!: FormGroup; 
  isSubmitting = signal(false);
  serverError = signal<string | null>(null);

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    });
  }

  submit(): void {
    debugger;
    this.serverError.set(null);

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const password = this.registerForm.get('password')?.value;
    const confirmPassword = this.registerForm.get('confirmPassword')?.value;

    if (password !== confirmPassword) {
      this.serverError.set('Passwords do not match');
      return;
    }

    const data: RegisterationRequestInterface = {
      name: this.registerForm.get('name')?.value!,
      email: this.registerForm.get('email')?.value!,
      password: password,
      role: 'Customer'
    };

    this.isSubmitting.set(true);

    this.authService.register(data).subscribe({
      next: (res) => {
        this.isSubmitting.set(false);
        this.router.navigate(['/']);
        console.log(res);
        
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.serverError.set(err?.error || 'Registration failed');
        console.log(err);
        
      }
    });
  }

}
