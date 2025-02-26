import { Routes } from '@angular/router';
import { EstateFormComponent } from './components/estate/estate-form/estate-form.component';
import { LoginComponent } from './components/login/login.component';
import { EmployeesComponent } from './components/employees/employees.component';
import { AuthGuard } from './auth.guard';
import { EstateListComponent } from './components/estate-list/estate-list.component';
import { AccountComponent } from './components/account/account.component';
import { RegistrationComponent } from './components/registration/registration.component';

export const routes: Routes = [
    
    //{path: '', component: EstateFormComponent}
    { path: '', component: LoginComponent },
    { path: 'employees', component: EmployeesComponent, canActivate: [AuthGuard] },
    { path: 'account', component: AccountComponent, canActivate: [AuthGuard] },
    { path: 'employees/new', component: RegistrationComponent, canActivate: [AuthGuard] },
    { path: 'estate', component: EstateListComponent , canActivate: [AuthGuard]},
    { path: 'estate/new', component: EstateFormComponent , canActivate: [AuthGuard]},
    { path: 'estate/edit/:id', component: EstateFormComponent , canActivate: [AuthGuard]},
    { path: '**', redirectTo: 'estate' }
];

export class AppRoutingModule {}
