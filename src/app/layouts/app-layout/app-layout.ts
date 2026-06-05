import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';

interface Routes{
  url: string,
  name: string,
}

@Component({
  selector: 'app-app-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app-layout.html',
})
export class AppLayout {
  routes: any[] = [
    {
      url: '',
      name: 'Home',
    },
    {
      url: '/biseccion',
      name: 'Biseccion',
    },
    {
      url: '/newton',
      name: 'Newton',
    }
  ];

  shouldAnimate = true;
  
  constructor(private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.shouldAnimate = false;
      setTimeout(() => this.shouldAnimate = true, 10);
    });
  }
  
  onNavigate(url: string) {
    this.shouldAnimate = false;
  }
}
