import { Component, HostListener, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { Sidebar } from "../../../../Shared/Components/sidebar/sidebar";
import { AuthService } from '../../../../Core/Services/Auth-Service/auth-service';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, Sidebar],
  templateUrl: './layout.html',
  styleUrl: './layout.scss',
})
export class Layout implements OnInit {
    isOpen:boolean = false;
    UserName:string ='';
    AvatarLetters:string ='';
    UserRole:string ='';


  pageTitles: any = {
    dashboard:  'Dashboard',
    orders:     'Order Management',
    kitchen:    'Kitchen Display',
    tables:     'Table Management',
    deliveries: 'Deliveries',
    payments:   'Payments',
    menu:       'Menu Items',
    stock:      'Stock',
    categories: 'Categories',
    users:      'Users',
    branches:   'Branches',
    reports:    'Reports',
    settings:   'Settings',
  };

  topbarTitle = '';

  constructor(private router: Router,private authService: AuthService) {

    /* 🔥 أهم جزء */
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => {
        const url = this.router.url.split('/').pop() || '';
        this.topbarTitle = this.pageTitles[url]  || 'Dashboard';
      });
  }
  ngOnInit(): void {
    this.GetCurrentUser();
  }

  /* SIDEBAR CONTROL */
  openSidebar() {
    console.log("clicked");
    
    this.isOpen = true;
    document.body.style.overflow = 'hidden';
  }

  closeSidebar() {
    this.isOpen = false;
    document.body.style.overflow = '';
  }

  /* ESC */
  @HostListener('document:keydown.escape')
  onEsc() {
    if (this.isOpen) this.closeSidebar();
  }

  /* RESIZE */
  @HostListener('window:resize')
  onResize() {
    if (window.innerWidth > 768) {
      this.isOpen = false;
      document.body.style.overflow = '';
    }
  }

  GetCurrentUser(){
    this.authService.getCurrentUser().subscribe({
      next:(res)=>{
        console.log(res);
        this.UserName = res.name
        this.UserRole = res.role
        this.AvatarLetters = res.name.split(' ').map((n) => n[0]).join('').toUpperCase();
      },
      error:(err)=>{
        console.log(err);
      }
    })
  }
}
