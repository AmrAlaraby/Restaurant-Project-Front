import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../Core/Services/Auth-Service/auth-service';
import { SidebarSection } from '../../../Core/Models/SharedModels/sidebar-section';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-sidebar',
  imports: [RouterModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar implements OnChanges {
  @Input() sections: SidebarSection[] = [];
  @Input() prefix: string = ''; // admin / cashier / etc
  @Input() isOpen = false;
  @Input() UserName:string ='';
  @Input() AvatarLetters:string ='';
  @Input() UserRole:string ='';
  @Output() close = new EventEmitter<void>();

  
  constructor(private auth :AuthService,
              private sanitizer: DomSanitizer) {}
  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.UserName);
    
  }
  onClose() {
    this.close.emit();
  }
    logout() {
  this.auth.logout();
  }
  sanitize(icon: string): SafeHtml {
  return this.sanitizer.bypassSecurityTrustHtml(icon);
}


}
