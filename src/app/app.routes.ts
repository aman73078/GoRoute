import { Routes } from '@angular/router';
import { FullComponent } from './full/full.component';
import { CanActivate } from './features/auth/auth.guard';
// import { AuthGuard } from './features/auth/auth.guard';

export const routes: Routes = [
  {
    path: 'overview',
    component: FullComponent,
    children: [
      {
        path: 'home',
        loadComponent: () =>
          import('./features/pages/home/home.component').then(
            (c) => c.HomeComponent
          ),
      },
      {
        path: 'listing',
        loadComponent: () =>
          import('./features/pages/listing/listing.component').then(
            (c) => c.ListingComponent
          ),
      },
      {
        path: 'booking',
        loadComponent: () =>
          import('./features/pages/booking/booking.component').then(
            (c) => c.BookingComponent
          ),
        // canActivate: [AuthGuard],
        canActivate: [CanActivate],
      },
      {
        path: 'auth',
        loadComponent: () =>
          import('./features/auth/auth.component').then((c) => c.AuthComponent),
      },
    ],
  },
  { path: '**', redirectTo: 'overview/home' },
];
