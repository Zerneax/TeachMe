import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { CalculComponent } from './pages/calcul/calcul.component';

const routes: Routes = [
  { path: '', component: WelcomeComponent},
  { path: 'calcul', component: CalculComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
