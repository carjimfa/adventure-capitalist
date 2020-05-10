import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ManagersComponent } from './pages/managers/managers.component';
import { PowerUpsComponent } from './pages/power-ups/power-ups.component';


const routes: Routes = [
  {path:"", component:HomeComponent},
  {path:"managers", component:ManagersComponent},
  {path:"power-ups", component:PowerUpsComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
