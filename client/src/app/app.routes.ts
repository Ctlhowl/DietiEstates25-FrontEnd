import { Routes } from '@angular/router';
import { DetailsComponent } from './components/estate/details/details.component';

export const routes: Routes = [
    //{ path: 'estate', component:  },
    //{ path: 'estate/history', component:  },
    //{ path: 'estate/favorite', component:  },
    { path: 'profile', component: DetailsComponent },
    { path: '**', redirectTo: 'estates' }
];

export class AppRoutingModule {}