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
        runGuardsAndResolvers: 'always',
        children: [
            {
                path: 'home',
                loadChildren: () => import('./features/home-page/homepage.routes').then(m => m.HomePage_ROUTES),
                canActivate: [authGuard] // extra safety

            },
            {
                path: 'users',
                loadChildren: () => import('./features/users/users.routes').then(m => m.Users_ROUTES),
                canActivate: [authGuard]
                
            }
            ,{
                path: 'profile',
                loadChildren: () => import('./features/profile/profile.routes').then(m => m.Profile_ROUTES),
                canActivate: [authGuard] // extra safety

            },
            {
                path: 'roles',
                loadChildren: () => import('./features/roles/roles.routes').then(m => m.Role_ROUTES),
                canActivate: [authGuard] // extra safety

            }
            ,{
                path: 'permissions',
                loadChildren: () => import('./features/permissions/permissions.routes').then(m => m.Permission_ROUTES),
                canActivate: [authGuard] // extra safety
    
            }
        ]
    },
];
