import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { GalleryComponent } from './components/gallery/gallery.component';
import { PhotoAddComponent } from './components/photo-add/photo-add.component';
import { PhotoListComponent } from './components/photo-list/photo-list.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { EditPhotoComponent } from './components/edit-photo/edit-photo.component';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    GalleryComponent,
    PhotoAddComponent,
    PhotoListComponent,
    NavigationComponent,
    EditPhotoComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    RouterModule,
  ],
  providers: [
    provideHttpClient(withFetch())
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
