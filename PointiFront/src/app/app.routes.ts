import { Routes } from '@angular/router';
import { Layout } from './shared/layout/layout';
import { authGuard } from './features/auth/auth.guard';

export const routes: Routes = [
    {
        path: '',
        loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
    },
    {
        path: 'loggedin',
        component: Layout,
        canActivate: [authGuard],
        canActivateChild: [authGuard],
        runGuardsAndResolvers: 'always',
        children: [
            {
                path: 'home',
                loadChildren: () => import('./features/home-page/homepage.routes').then(m => m.HomePage_ROUTES)
            },
            {
                path: 'users',
                loadChildren: () => import('./features/users/users.routes').then(m => m.Users_ROUTES),
                canActivate: [authGuard]
                
            }
         
        ]
    }
];
