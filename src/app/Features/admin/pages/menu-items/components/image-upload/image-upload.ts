import { Component, EventEmitter, Input, Output } from '@angular/core';

import { CommonModule } from '@angular/common';
import { OnChanges, SimpleChanges } from '@angular/core';
@Component({
  selector: 'app-image-upload',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './image-upload.html',
  styleUrls: ['./image-upload.scss'],
})
export class ImageUpload implements OnChanges {
  @Input()
  currentImageUrl?: string;

  @Output()
  imageSelected = new EventEmitter<File>();

  previewUrl?: string;

  isDragging = false;

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files?.length) return;

    this.handleFile(input.files[0]);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;

    const file = event.dataTransfer?.files?.[0];

    if (!file) return;

    this.handleFile(file);
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = true;
  }

  onDragLeave(): void {
    this.isDragging = false;
  }

  handleFile(file: File): void {
    if (!file.type.startsWith('image/')) return;

    this.imageSelected.emit(file);

    const reader = new FileReader();

    reader.onload = () => {
      this.previewUrl = reader.result as string;
    };

    reader.readAsDataURL(file);
  }

  get displayedImage(): string | undefined {
    return this.previewUrl || this.currentImageUrl;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['currentImageUrl']) {
      this.previewUrl = undefined;
    }
  }
}
