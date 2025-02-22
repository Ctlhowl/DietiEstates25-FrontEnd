import { Routes } from '@angular/router';
import { EstateFormComponent } from './components/estate/estate-form/estate-form.component';
import { LoginComponent } from './components/login/login.component';
import { EmployeesComponent } from './components/employees/employees.component';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
    
    //{path: '', component: EstateFormComponent}
    {path: '', component: LoginComponent},
    {path: 'list', component: EmployeesComponent, canActivate: [AuthGuard]}
];

export class AppRoutingModule {}
