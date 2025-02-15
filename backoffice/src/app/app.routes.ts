import { Routes } from '@angular/router';
import { EstateFormComponent } from './components/estate/estate-form/estate-form.component';
import { EstateListComponent } from './components/estate-list/estate-list.component';

export const routes: Routes = [
    { path: 'estate', component: EstateListComponent },
    { path: 'estate/new', component: EstateFormComponent },
    { path: 'estate/edit/:id', component: EstateFormComponent },
    { path: '**', redirectTo: 'estate' }
];

export class AppRoutingModule {}
