// src/app/features/auth/auth.routes.ts
import { Routes } from '@angular/router';
import { Users } from '../users/users';
import { Profile } from './profile';

export const Profile_ROUTES: Routes = [
  { path: '', component: Profile },
];
