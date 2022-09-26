import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HeroesComponent } from './heroes/heroes.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HeroDetailComponent } from './hero-detail/hero-detail.component'

const routes: Routes = [
  {path:'', redirectTo:'/dashboard', pathMatch:'full'},
  {path:'heroes', component:HeroesComponent},
  {path:'dashboard', component:DashboardComponent},
  {path:'detail/:id', component:HeroDetailComponent}, //Los dos puntos indican que id es un marcador de posición para un id de héroe específico.


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],  //configura el enrutador en el nivel raíz de la app
  exports: [RouterModule]                   //se exporta para que esté disponible en toda la app
})
export class AppRoutingModule { }
