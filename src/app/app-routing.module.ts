import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TourDetailsComponent } from 'src/app/tour-details/tour-details.component';
import { TourListComponent } from 'src/app/tour-list/tour-list.component';
import { UserManageComponent } from 'src/app/user-manage/user-manage.component';
import { WelcomePageComponent } from 'src/app/welcome-page/welcome-page.component';
import { HomePageComponent } from 'src/app/home-page/home-page.component';
import { AboutPageComponent } from 'src/app/about-page/about-page.component';
import { LoginPageComponent } from 'src/app/login-page/login-page.component';
import { TourCubeComponent } from 'src/app/tour-cube/tour-cube.component';
import { UserCubeComponent } from 'src/app/user-cube/user-cube.component';
import { BookingListComponent } from 'src/app/booking-list/booking-list.component';
import { UserProfileComponent } from 'src/app/user-profile/user-profile.component';


const routes: Routes = [
  {
    path:"",redirectTo:"/welcome/home",pathMatch:"full"
  },
  {
    path:"tourDetails",component:TourListComponent
  },
  {
    path:"tourDetails/:id",component:TourDetailsComponent
  },
  {
    path:"userManage",
    
    component:UserManageComponent,
    children:[
      {
        path:"my-profile",component:UserProfileComponent
      },
      {
        path:"tours",component:TourCubeComponent
      },
      {
        path:"users",component:UserCubeComponent
      },
      {
        path:"bookings",component:BookingListComponent
      },
      {
        path:"my-bookings",component:BookingListComponent
      }
    ]
  },
  {
    path:"welcome",
    component:WelcomePageComponent,
    children:[
      {
        path:"home",component:HomePageComponent
      },
      {
        path:"about",component:AboutPageComponent
      },
      {
        path:"login",component:LoginPageComponent
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
