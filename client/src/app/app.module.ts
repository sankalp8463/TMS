import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomepageComponent } from './pages/homepage/homepage.component';
import { NavComponent } from './componet/nav/nav.component';
import { AuthFlipComponent } from './componet/auth-flip/auth-flip.component';
import { DashboardComponent } from './componet/dashboard/dashboard.component';
import { ProfilePopComponent } from './componet/profile-pop/profile-pop.component';
import { CourseComponent } from './componet/users/admin/course/course.component';
import { ShowcourseComponent } from './componet/showcourse/showcourse.component';


@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    ShowcourseComponent,
    

  
    
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AuthFlipComponent,
    ProfilePopComponent,
    DashboardComponent,
    NavComponent
],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
