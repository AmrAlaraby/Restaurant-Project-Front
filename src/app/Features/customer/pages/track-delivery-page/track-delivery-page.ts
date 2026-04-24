import { Component, inject, OnInit, signal } from '@angular/core';
import { DeliveryService } from '../../../../Core/Services/Delivery-Service/delivery-service';
import { ActivatedRoute, Router } from '@angular/router';
import { Delivery } from '../../../../Core/Models/DeliveryModels/delivery';
import { TimelineStep } from '../../../../Core/Models/DeliveryModels/track-delivery-types';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-track-delivery-page',
  imports: [FormsModule, CommonModule],
  templateUrl: './track-delivery-page.html',
  styleUrl: './track-delivery-page.scss',
})
export class TrackDeliveryPage implements OnInit {
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
}
