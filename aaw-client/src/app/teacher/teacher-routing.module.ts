import { MarkFormComponent } from './mark-form/mark-form.component';
import { MarksComponent } from './marks/marks.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main/main.component';


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
        path: 'marks-form/:id',
        component: MarkFormComponent
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
export class TeacherRoutingModule { }
