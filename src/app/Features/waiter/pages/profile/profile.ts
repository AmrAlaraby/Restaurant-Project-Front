import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UpdateCurrentUserInterface } from '../../../../Core/Models/AuthModels/update-current-user-interface';
import { UserInterface } from '../../../../Core/Models/AuthModels/user-interface';
import { AuthService } from '../../../../Core/Services/Auth-Service/auth-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  user = signal<UserInterface | null>(null);
  saved = signal(false);
  saveError = signal('');
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
      },
    });
  }

  private passwordMatchValidator(group: FormGroup) {
    const pass = group.get('newPassword')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return pass && confirm && pass !== confirm ? { passwordMismatch: true } : null;
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

    this.saveError.set('');

    const v = this.form.value;

    const name = v.name?.trim();
    const userNameInput = v.userName?.trim();

    const dto: UpdateCurrentUserInterface = {
      name: name,
      email: v.email?.trim(),
      userName: userNameInput && userNameInput !== '' ? userNameInput : name, // 🔥 هنا الحل
      newPassword: v.newPassword?.trim() || undefined,
      confirmPassword: v.confirmPassword?.trim() || undefined,
    };

    console.log(dto); // 👈 تأكد

    this.authService.updateCurrentUser(this.user()!.email, dto).subscribe({
      next: (updated) => {
        this.user.set(updated);
        this.saved.set(true);
        setTimeout(() => this.saved.set(false), 3000);
      },
      error: (err) => {
        console.log(err);
        this.saveError.set(err?.error || 'Something went wrong');
      },
    });
  }

  onLogout(): void {
    this.authService.logout();
  }
}
