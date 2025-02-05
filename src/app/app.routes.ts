import { Routes } from '@angular/router';
import { ImageListComponent } from './image-list/image-list.component';
import { ImageDetailsComponent } from './image-details/image-details.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

export const routes: Routes = [
    { path: '', pathMatch: 'full', redirectTo: 'images' },
    { path: 'images', component: ImageListComponent },
    { path: 'images/:id', component: ImageDetailsComponent },
    { path: '**', pathMatch: 'full', component: PageNotFoundComponent }
];
