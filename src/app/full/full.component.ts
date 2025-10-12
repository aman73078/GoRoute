import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-full',
  imports: [CommonModule, RouterOutlet, RouterLink],
  templateUrl: './full.component.html',
  styleUrl: './full.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FullComponent {
  isMenuOpen = signal(false);
  currentYear = new Date().getFullYear(); // Added currentYear for dynamic copyright

  navLinks = signal([
    { label: 'Bus Tickets', href: '#' },
    { label: 'Cab Booking', href: '#' },
    { label: 'Help', href: '#' },
    { label: 'Manage Booking', href: '#' },
  ]);
  animateLogo = true;

  constructor(private router: Router) {}

  ngOnInit() {
    // Listen to route changes
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.restartAnimation();
    });
  }

  restartAnimation() {
    this.animateLogo = false;
    // Trigger reflow to restart animation
    setTimeout(() => {
      this.animateLogo = true;
    }, 10);
  }
  
  
  toggleMenu() {
    this.isMenuOpen.update(value => !value);
  }
}
