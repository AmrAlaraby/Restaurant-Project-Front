import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../Core/Services/Auth-Service/auth-service';

@Component({
  selector: 'app-reset-password',
  imports: [ReactiveFormsModule],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.scss',
})
export class ResetPassword {
  form!: FormGroup;
  loading = false;
  error: string | null = null;
  success: string | null = null;
  showPassword = false;
  strength = 0;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    });

    this.form.get('password')?.valueChanges.subscribe(val => {
      this.checkStrength(val);
    });
  }

  // 🔐 password strength
  checkStrength(password: string) {
    let score = 0;

    if (!password) {
      this.strength = 0;
      return;
    }

    if (password.length >= 6) score += 25;
    if (password.length >= 10) score += 25;
    if (/[A-Z]/.test(password)) score += 25;
    if (/[0-9]/.test(password)) score += 25;

    this.strength = score;
  }

  // 👁 toggle password
  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  // 🚀 submit
  submit() {
    this.error = null;
    this.success = null;

    if (this.form.invalid) return;

    const token = localStorage.getItem('resetSessionToken');

    if (!token) {
      this.error = 'Session expired. Please try again.';
      return;
    }

    const password = this.form.value.password;
    const confirmPassword = this.form.value.confirmPassword;

    if (password !== confirmPassword) {
      this.error = 'Passwords do not match';
      return;
    }

    this.loading = true;

    const payload = {
      resetSessionToken: token,
      newPassword: password,
      confirmPassword: confirmPassword
    };

    this.auth.resetPassword(payload).subscribe({
      next: (res) => {
        this.loading = false;

        this.success = 'Password reset successfully 🎉';

        // clear token
        localStorage.removeItem('resetSessionToken');

        // redirect after delay
        setTimeout(() => {
          this.router.navigate(['/auth/login']);
        }, 1500);
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error || 'Reset password failed';
        console.error('Error resetting password:', err);
      }
    });
  }
}
