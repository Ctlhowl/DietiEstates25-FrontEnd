import { Routes } from '@angular/router';
import { EstateFormComponent } from './components/estate/estate-form/estate-form.component';
import { LoginComponent } from './components/login/login.component';
import { EmployeesComponent } from './components/employees/employees.component';
import { AuthGuard } from './auth.guard';
import { EstateListComponent } from './components/estate-list/estate-list.component';

export const routes: Routes = [
    
    //{path: '', component: EstateFormComponent}
    {path: '', component: LoginComponent},
    {path: 'list', component: EmployeesComponent, canActivate: [AuthGuard]},
    { path: 'estate', component: EstateListComponent },
    { path: 'estate/new', component: EstateFormComponent },
    { path: 'estate/edit/:id', component: EstateFormComponent },
    { path: '**', redirectTo: 'estate' }
];

export class AppRoutingModule {}
