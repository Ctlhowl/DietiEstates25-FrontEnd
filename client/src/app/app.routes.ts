import { Routes } from '@angular/router';
import { DetailsComponent } from './components/estate/details/details.component';
import { LoginComponent } from './components/login/login.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { AccountComponent } from './components/account/account.component';

export const routes: Routes = [
    //{ path: 'estate', component:  },
    //{ path: 'estate/history', component:  },
    //{ path: 'estate/favorite', component:  },
    //{ path: 'profile', component: DetailsComponent },
    //{ path: '**', redirectTo: 'estates' },
    { path: '', component: LoginComponent},
    { path: 'registration', component: RegistrationComponent},
    { path: 'account', component: AccountComponent}
];

export class AppRoutingModule {}