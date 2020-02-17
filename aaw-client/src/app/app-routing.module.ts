import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RouterAuthService } from './router-auth.service';


const routes: Routes = [
  {
    path: 'login', component: LoginComponent,
  },
  {
    path: 'student', canActivate: [RouterAuthService], loadChildren: () => import('./student/student.module').then(mod => mod.StudentModule)
  },
  {
    path: 'teacher', canActivate: [RouterAuthService], loadChildren: () => import('./teacher/teacher.module').then(mod => mod.TeacherModule)
  },
  {
    path: 'admin', canActivate: [RouterAuthService], loadChildren: () => import('./admin/admin.module').then(mod => mod.AdminModule)
  },
  {
    path: '', redirectTo: '/login', pathMatch: 'full'
  },
  {
    path: '**', redirectTo: '/login', pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
