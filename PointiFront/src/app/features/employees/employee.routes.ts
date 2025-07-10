// src/app/features/auth/auth.routes.ts
import { Routes } from '@angular/router';
import { Users } from '../users/users';
import { Employees } from './employees';

export const Employee_ROUTES: Routes = [
  { path: '', component: Employees },
];
