import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { LangSwitchComponent } from "../../../../Shared/Components/lang-switch/lang-switch";

@Component({
  selector: 'app-auth-layout',
  imports: [RouterOutlet, TranslatePipe, LangSwitchComponent],
  templateUrl: './auth-layout.html',
  styleUrl: './auth-layout.scss',
})
export class AuthLayout {

}
