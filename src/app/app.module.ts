import { BrowserModule } from '@angular/platform-browser';

import { NgModule } from '@angular/core';

import { FileUploadModule} from 'ng2-file-upload';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';


import {  HttpClientModule ,HTTP_INTERCEPTORS} from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';


import { AuthInterceptor } from './interceptor';




import { TourDetailsComponent } from './tour-details/tour-details.component';
import { TourListComponent } from './tour-list/tour-list.component';
import { UserManageComponent } from './user-manage/user-manage.component';
import { WelcomePageComponent } from './welcome-page/welcome-page.component';
import { HomePageComponent } from './home-page/home-page.component';
import { AboutPageComponent } from './about-page/about-page.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { MapComponent } from './map/map.component';
import { TourCubeComponent } from './tour-cube/tour-cube.component';
import { UserCubeComponent } from './user-cube/user-cube.component';
import { ExampleComponent } from './example/example.component';
import { DialogComponent } from './../app/dialog/dialog.component';
import { EditComponent } from './edit/edit.component';
import { BookingListComponent } from './booking-list/booking-list.component';
import { HttpService } from 'src/app/http.service';
import { EditUserComponent } from './edit-user/edit-user.component';
import { EditTourComponent } from './edit-tour/edit-tour.component';
import { SearchHeaderComponent } from './search-header/search-header.component';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { UserProfileCardComponent } from './user-profile-card/user-profile-card.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { ReviewComponent } from './review/review.component';
import { RatingComponent } from './rating/rating.component';
import { UserProfileDialogWrapperComponent } from './user-profile-dialog-wrapper/user-profile-dialog-wrapper.component';
import { ChartComponent } from './chart/chart.component';


@NgModule({
  declarations: [
    AppComponent,
    TourDetailsComponent,
    TourListComponent,
    UserManageComponent,
    WelcomePageComponent,
    HomePageComponent,
    AboutPageComponent,
    LoginPageComponent,
    MapComponent,
    TourCubeComponent,
    UserCubeComponent,
    ExampleComponent,
    DialogComponent,
    EditComponent,
    BookingListComponent,
    EditUserComponent,
    EditTourComponent,
    SearchHeaderComponent,
    LoadingSpinnerComponent,
    UserProfileCardComponent,
    UserProfileComponent,
    ReviewComponent,
    RatingComponent,
    UserProfileDialogWrapperComponent,
    ChartComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    FileUploadModule,
    AgGridModule.withComponents([]),
  ],
  entryComponents: [EditUserComponent,EditTourComponent,DialogComponent,ReviewComponent,UserProfileDialogWrapperComponent],
  providers: [
    HttpService, {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true // option. This is required and tells Angular that HTTP_INTERCEPTORS is an array of values, rather than a single value.
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
