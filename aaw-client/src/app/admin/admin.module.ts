import { UsersFormComponent } from './users-form/users-form.component';
import { MarksComponent } from './marks/marks.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { MainComponent } from './main/main.component';
import { MaterialModule } from '../material.module';
import { SharedModule } from '../shared/shared.module';
import { MarkFormComponent } from './mark-form/mark-form.component';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';
import { ReactiveFormsModule } from '@angular/forms';
import { DeliberationsComponent } from './deliberations/deliberations.component';
import { DeliberationsFormComponent } from './deliberations-form/deliberations-form.component';
import { CoursesFormComponent } from './courses-form/courses-form.component';
import { CoursesComponent } from './courses/courses.component';
import { StudentComponent } from './student/student.component';
import { TeacherComponent } from './teacher/teacher.component';
import { AdminComponent } from './admin/admin.component';


@NgModule({
  declarations: [
    MainComponent,
    MarksComponent,
    MarkFormComponent,
    DeliberationsComponent,
    DeliberationsFormComponent,
    CoursesFormComponent,
    CoursesComponent,
    StudentComponent,
    TeacherComponent,
    AdminComponent,
    UsersFormComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    MaterialModule,
    SharedModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatRadioModule,
    MatCardModule,
    ReactiveFormsModule
  ]
})
export class AdminModule { }
