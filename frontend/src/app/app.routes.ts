import { Routes } from '@angular/router';
import { EstateFormComponent } from './components/estate/estate-form/estate-form.component';
import { EstateListComponent } from './components/estate-list/estate-list.component';

export const routes: Routes = [
    
    {path: '', component: EstateListComponent}
];

export class AppRoutingModule {}
