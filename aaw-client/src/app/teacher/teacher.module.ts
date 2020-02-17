import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TeacherRoutingModule } from './teacher-routing.module';
import { MainComponent } from './main/main.component';
import { MaterialModule } from '../material.module';
import { SharedModule } from '../shared/shared.module';
import { MarksComponent } from './marks/marks.component';
import { MarkFormComponent } from './mark-form/mark-form.component';


@NgModule({
  declarations: [MainComponent, MarksComponent, MarkFormComponent],
  imports: [
    CommonModule,
    TeacherRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class TeacherModule { }
