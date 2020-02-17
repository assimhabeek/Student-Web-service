import { DeliberationComponent } from './deliberation/deliberation.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main/main.component';
import { MarksComponent } from './marks/marks.component';


const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: 'marks',
        component: MarksComponent
      },
      {
        path: 'deliberation',
        component: DeliberationComponent
      },

    ]
  },
  {
    path: '**', pathMatch: 'full', redirectTo: ''
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentRoutingModule { }
