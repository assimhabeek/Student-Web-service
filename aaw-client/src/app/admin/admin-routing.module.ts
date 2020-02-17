import { AdminComponent } from './admin/admin.component';
import { CoursesFormComponent } from './courses-form/courses-form.component';
import { DeliberationsComponent } from './deliberations/deliberations.component';
import { MarkFormComponent } from './mark-form/mark-form.component';
import { MarksComponent } from './marks/marks.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main/main.component';
import { DeliberationsFormComponent } from './deliberations-form/deliberations-form.component';
import { CoursesComponent } from './courses/courses.component';
import { StudentComponent } from './student/student.component';
import { UsersFormComponent } from './users-form/users-form.component';
import { TeacherComponent } from './teacher/teacher.component';


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
      {
        path: 'deliberations',
        component: DeliberationsComponent
      },
      {
        path: 'deliberations-form/:id',
        component: DeliberationsFormComponent
      },
      {
        path: 'courses',
        component: CoursesComponent
      },
      {
        path: 'courses-form/:id',
        component: CoursesFormComponent
      },
      {
        path: 'students',
        component: StudentComponent
      },
      {
        path: 'teachers',
        component: TeacherComponent
      },
      {
        path: 'admins',
        component: AdminComponent
      },
      {
        path: 'users-form/:id',
        component: UsersFormComponent
      }
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
export class AdminRoutingModule { }
