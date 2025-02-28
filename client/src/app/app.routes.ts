import { Routes } from '@angular/router';
import { ListComponent } from './components/list/list.component';
import { LoginComponent } from './components/login/login.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { ProfileComponent } from './components/profile/profile.component';
import { DetailsComponent } from './components/details/details.component';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
    { path: 'estates', component: ListComponent },
    { path: 'estates/my-offers', component: ListComponent , canActivate: [AuthGuard]},
    { path: 'estates/favorites', component: ListComponent , canActivate: [AuthGuard]},
    { path: 'login', component: LoginComponent },
    { path: 'sign-up', component: SignUpComponent },
    { path: 'profile', component: ProfileComponent , canActivate: [AuthGuard]},
    { path: 'estates/:id', component: DetailsComponent },
    { path: '**', redirectTo: 'estates' }
];

export class AppRoutingModule {}