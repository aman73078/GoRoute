import { Routes } from '@angular/router';
import { FullComponent } from './full/full.component';

export const routes: Routes = [
    {
        path:'overview',
        component:FullComponent,
        children:[
            { path:'home', loadComponent: () => import('./features/pages/home/home.component').then(c => c.HomeComponent)},
            { path:'listing', loadComponent:() => import('./features/pages/listing/listing.component').then(c => c.ListingComponent)},
            {path:'auth', loadComponent: () => import('./features/pages/auth/auth.component').then(c => c.AuthComponent)},
        ]
    },
    { path: '**', redirectTo:'overview/home'}
];
