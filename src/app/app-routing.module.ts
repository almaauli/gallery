import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { GalleryComponent } from './components/gallery/gallery.component';
import { PhotoAddComponent } from './components/photo-add/photo-add.component';
import { PhotoListComponent } from './components/photo-list/photo-list.component';
import { EditPhotoComponent } from './components/edit-photo/edit-photo.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'gallery', component: GalleryComponent },
  { path: 'photo-add/:userId', component: PhotoAddComponent }, // Rute baru dengan userId
  { path: 'photo-list', component: PhotoListComponent },
  { path: 'edit-photo/:id', component: EditPhotoComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
