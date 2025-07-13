import { Routes } from '@angular/router';
import { Layout } from './shared/layout/layout';
import { authGuard } from './features/auth/auth.guard';
import { PermissionGuard } from './guards/permission.guard';
import { Unauthorized } from './features/unauthorized/unauthorized';

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
                canActivate: [authGuard,PermissionGuard],
                data: { permission: 'USER_MANAGEMENT' }
                
                
            }
            ,{
                path: 'profile',
                loadChildren: () => import('./features/profile/profile.routes').then(m => m.Profile_ROUTES),
                 canActivate: [authGuard,],

            },
            {
                path: 'roles',
                loadChildren: () => import('./features/roles/roles.routes').then(m => m.Role_ROUTES),
                 canActivate: [authGuard,PermissionGuard],
                data: { permission: 'ROLE_MANAGEMENT' }
            }
            ,{
                path: 'permissions',
                loadChildren: () => import('./features/permissions/permissions.routes').then(m => m.Permission_ROUTES),
                 canActivate: [authGuard,PermissionGuard],
                data: { permission: 'PERMISSION_MANAGEMENT' }
            },
            {
                path: 'employees',
                loadChildren: () => import('./features/employees/employee.routes').then(m => m.Employee_ROUTES),
                 canActivate: [authGuard,PermissionGuard],
                data: { permission: 'EMPLOYEE_MANAGEMENT' }
            }, 
            {
                path: 'badges',
                loadChildren: () => import('./features/badges/badges.route').then(m => m.Badges_ROUTES),
                 canActivate: [authGuard,PermissionGuard],
                data: { permission: 'BADGE_MANAGEMENT' }


            }, 
            {
                path: 'visitors',
                loadChildren: () => import('./features/visitors/visitors.routes').then(m => m.Visitor_ROUTES),
                 canActivate: [authGuard,PermissionGuard],
                data: { permission: 'VISITOR_MANAGEMENT' }

            },
            {
                path: 'unauthorized',
                component: Unauthorized
  }
        ]
    },
];
