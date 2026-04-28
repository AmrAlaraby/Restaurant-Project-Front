import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UpdateCurrentUserInterface } from '../../../../Core/Models/AuthModels/update-current-user-interface';
import { UserInterface } from '../../../../Core/Models/AuthModels/user-interface';
import { AuthService } from '../../../../Core/Services/Auth-Service/auth-service';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { ToastService } from '../../../../Core/Services/Toast-Service/toast-service';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, ReactiveFormsModule,TranslatePipe],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
private toast = inject(ToastService);

  user = signal<UserInterface | null>(null);
  loading = signal(true);

  form!: FormGroup;

  // بيانات ثابتة للـ shift (جيها من API تاني لو عندك)
  shiftInfo = {
    shiftStart: '09:00 AM',
    shiftEnd: '05:00 PM',
    section: 'Tables 1–6, 8',
    todaysOrders: 8,
    totalOrders: 156,
    totalSales: 48000,
    rating: 4.7,
  };

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe({
      next: (user) => {
        this.user.set(user);
        this.loading.set(false);
        this.form = this.fb.group(
          {
            name: [user.name, Validators.required],
            email: [user.email, [Validators.required, Validators.email]],
            userName: [''],
            newPassword: ['', [Validators.minLength(6)]],
            confirmPassword: [''],
          },
          { validators: this.passwordMatchValidator },
        );
      },
      error: () => {
        this.loading.set(false);
        this.toast.error('Failed to load user');
      },
    });
  }

  private passwordMatchValidator(group: FormGroup) {
    const pass = group.get('newPassword')?.value?.trim();
    const confirm = group.get('confirmPassword')?.value?.trim();

    // If newPassword is filled, confirmPassword must also be filled and match
    if (pass && !confirm) return { passwordMismatch: true };
    if (pass && confirm && pass !== confirm) return { passwordMismatch: true };
    return null;
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  }

  onSave(): void {
    if (this.form.invalid || !this.user()) return;

   

    const v = this.form.value;
    const name = v.name?.trim();
    const userNameInput = v.userName?.trim();
    const newPassword = v.newPassword?.trim();
    const confirmPassword = v.confirmPassword?.trim();

    // Helper to clean userName - letters and digits only
    const sanitize = (str: string) =>
      str
        .toLowerCase()
        .replace(/\s+/g, '')
        .replace(/[^a-z0-9]/g, '');

    const dto: UpdateCurrentUserInterface = {
      name: name,
      email: v.email?.trim(),
      userName: userNameInput ? sanitize(userNameInput) : sanitize(name),
      ...(newPassword ? { newPassword, confirmPassword } : {}),
    };
    

    this.authService.updateCurrentUser(this.user()!.email, dto).subscribe({
      next: (updated) => {
        this.user.set(updated);
        this.toast.success('Profile updated successfully');
      },
      error: (err) => {
        const errBody = err?.error;
        const msg =
          typeof errBody === 'string'
            ? errBody
            : errBody?.message
              ? typeof errBody.message === 'string'
                ? errBody.message
                : JSON.stringify(errBody.message)
              : 'Something went wrong';
      this.toast.error(msg);      },
    });
  }

  onLogout(): void {
    this.authService.logout();
  }
}
