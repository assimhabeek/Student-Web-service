import { NgModule } from '@angular/core';
import { MaterialModule } from '../material.module';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserProfileComponent } from './user-profile/user-profile.component';

@NgModule({
  declarations: [
    UserProfileComponent],
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
  ],
  exports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    UserProfileComponent
  ]
})
export class SharedModule {
}
