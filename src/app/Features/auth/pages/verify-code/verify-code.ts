import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../Core/Services/Auth-Service/auth-service';
import { FormsModule, NgModel } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-verify-code',
  imports: [FormsModule],
  templateUrl: './verify-code.html',
  styleUrl: './verify-code.scss',
})
export class VerifyCode {
  otp: string[] = ['', '', '', '', '', ''];
  loading = false;
  error: string | null = null;

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  // 🟢 جمع الكود
  getCode(): string {
    return this.otp.join('');
  }

  // 🟢 verify API
  verifyCode() {
    this.error = null;

    const code = this.getCode();

    if (this.otp.some(x => x === '')) {
  this.error = 'Please enter full 6-digit code';
  return;
}

    this.loading = true;

    this.auth.verifyCode(code).subscribe({
      next: (res) => {
        this.loading = false;

        // 💾 save reset token
        localStorage.setItem('resetSessionToken', res.resetSessionToken);

        // 🚀 go to reset password page
        this.router.navigate(['/auth/reset-password']);
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error || 'Invalid or expired code';
        console.error('Error verifying code:', err);
      }
    });
  }

  // 🟡 auto move input
  move(event: any, index: number) {
    const value = event.target.value;

    if (value && index < 5) {
      const next = document.querySelectorAll('input')[index + 1] as HTMLElement;
      next?.focus();
    }

    if (!value && index > 0 && event.inputType === 'deleteContentBackward') {
      const prev = document.querySelectorAll('input')[index - 1] as HTMLElement;
      prev?.focus();
    }
  }
}
