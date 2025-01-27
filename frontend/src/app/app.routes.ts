import { Routes } from '@angular/router';
import { FormComponent } from './components/backoffice/estate/form/form.component';
import { SidebarComponent } from './components/backoffice/sidebar/sidebar.component';

export const routes: Routes = [
    { path: '', component: SidebarComponent }
];

export class AppRoutingModule {}
