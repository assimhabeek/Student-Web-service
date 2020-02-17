import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudentRoutingModule } from './student-routing.module';
import { MainComponent } from './main/main.component';
import { MaterialModule } from '../material.module';
import { SharedModule } from '../shared/shared.module';
import { MarksComponent } from './marks/marks.component';
import { DeliberationComponent } from './deliberation/deliberation.component';


@NgModule({
  declarations: [MainComponent, MarksComponent, DeliberationComponent],
  imports: [
    CommonModule,
    StudentRoutingModule,
    MaterialModule,
    SharedModule
  ]
})
export class StudentModule { }
