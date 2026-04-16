import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Toast } from './Shared/Components/toast/toast';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Toast ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('Restaurant-Project-Front');
}
