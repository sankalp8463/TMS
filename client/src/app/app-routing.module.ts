import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthFlipComponent } from './componet/auth-flip/auth-flip.component';
import { DashboardComponent } from './componet/dashboard/dashboard.component';
import { ShowcourseComponent } from './componet/showcourse/showcourse.component';
import { ShowStudyMaterialComponent } from './componet/study-material/show-study-material/show-study-material.component';
import { TrainerComponent } from './componet/trainer/trainer.component';

const routes: Routes = [
  { path: 'login', component: AuthFlipComponent },
  { path: 'dashboard', component: DashboardComponent },
  {path:'courses', component: ShowcourseComponent},
{ path: 'study-material/:courseId', component: ShowStudyMaterialComponent },
{path:'trainer',component:TrainerComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
