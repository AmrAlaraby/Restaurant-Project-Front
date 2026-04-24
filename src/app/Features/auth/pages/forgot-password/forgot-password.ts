import { Component } from '@angular/core';
import { ReactiveFormsModule, Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../../Core/Services/Auth-Service/auth-service';

@Component({
  selector: 'app-forgot-password',
  imports: [ReactiveFormsModule],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.scss',
})
export class ForgotPassword {
  isSubmitting = false;
  message: string | null = null;

form!: FormGroup;




constructor(
  private fb: FormBuilder,
  private auth: AuthService,
  private router: Router,
  private route: ActivatedRoute   
  
) {}

  submit() {
    if (this.form.invalid) return;

    this.isSubmitting = true;

    this.auth.sendResetCode(this.form.value.email!).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.router.navigate(['/auth/verify-code']);
      },
      error: (err) => {
        this.isSubmitting = false;
        this.message = err.error || 'Error sending code';
        console.error('Error sending reset code:', err);
      }
    });
  }

  ngOnInit(): void {

  this.form = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  this.route.queryParams.subscribe(params => {
    if (params['email']) {
      this.form.patchValue({
        email: params['email']
      });
    }
  });
}
}
