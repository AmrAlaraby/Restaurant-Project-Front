import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimelineStep } from '../../../../../Core/Models/DeliveryModels/track-delivery-types';

@Component({
  selector: 'app-track-timeline',
  imports: [CommonModule],
  templateUrl: './track-time-line.html',
  styleUrl: './track-time-line.scss',
})
export class TrackTimeline {
  steps        = input.required<TimelineStep[]>();
  currentIndex = input.required<number>();

  getStepState(i: number): 'done' | 'active' | 'inactive' {
    const cur = this.currentIndex();
    if (i < cur) return 'done';
    if (i === cur) return 'active';
    return 'inactive';
  }

  getStepDesc(step: TimelineStep, i: number): string {
    const state = this.getStepState(i);
    if (state === 'done')   return step.doneDesc;
    if (state === 'active') return step.activeDesc;
    return step.pendingDesc;
  }

  formatTime(ts: string | null | undefined): string | null {
    if (!ts) return null;
    return new Date(ts).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  }
}