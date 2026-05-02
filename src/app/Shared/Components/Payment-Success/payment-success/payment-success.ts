import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-payment-success',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './payment-success.html',
  styleUrls: ['./payment-success.scss'],
})
export class PaymentSuccess implements OnInit, OnDestroy {
  showContent = false;
  showCheckmark = false;
  showDetails = false;
  showButton = false;
  countdown = 10;

  private countdownInterval: any;



  constructor(private router: Router) {}

  ngOnInit(): void {
    setTimeout(() => (this.showContent = true), 100);
    setTimeout(() => (this.showCheckmark = true), 400);
    setTimeout(() => (this.showDetails = true), 900);
    setTimeout(() => (this.showButton = true), 1300);

    this.countdownInterval = setInterval(() => {
      this.countdown--;
      if (this.countdown === 0) {
        this.clearCountdown();
        this.goToMenu();
      }
    }, 1000);
  }

  ngOnDestroy(): void {
    this.clearCountdown();
  }

  private clearCountdown(): void {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
      this.countdownInterval = null;
    }
  }

  goToMenu(): void {
    this.clearCountdown();
    this.router.navigate(['/customer/browse-menu']);
  }
}
