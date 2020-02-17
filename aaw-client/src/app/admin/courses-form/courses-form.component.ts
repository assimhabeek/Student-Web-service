import { BaseService } from './../../services/base-service';
import { debounceTime, distinctUntilChanged, flatMap, map } from 'rxjs/operators';
import { environment } from './../../../environments/environment';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/model/user';
import { Course } from 'src/app/model/course';
import { Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-courses-form',
  templateUrl: './courses-form.component.html',
  styleUrls: ['./courses-form.component.scss']
})
export class CoursesFormComponent implements OnInit {

  filteredTeachers: Observable<User>;
  record: Course;
  coursesForm = this.fb.group({
    abb: [null, Validators.required],
    name: [null, Validators.required],
    description: [null, Validators.required],
    unit: [null, Validators.required],
    teacher: [null, Validators.required],
  });


  constructor(
    private activeRoute: ActivatedRoute,
    private fb: FormBuilder,
    private _baseService: BaseService) { }



  ngOnInit(): void {
    const teacherValues = this.coursesForm.controls.teacher.valueChanges;
    this.activeRoute.params.subscribe(p => {
      if (p && p.id && p.id != 0) {
        this._baseService.getRecord(environment.segmentUrls.admin.courses, p.id)
          .subscribe(v => {
            this.record = v.data;
            this.coursesForm.patchValue(v.data);
          });
      }
    });


    this.filteredTeachers = teacherValues.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      flatMap(x => {
        return this._baseService.getRecords(environment.segmentUrls.admin.teachers, 0, null, null, x)
          .pipe(map(y => y.data.records));
      }));


  }


  displayTeacherFn(ele?: any): string | undefined {
    return ele ? ele.fullName : undefined;
  }

  onSubmit() {
    if (this.record) {
      for (const key in this.coursesForm.value) {
        if (this.coursesForm.value.hasOwnProperty(key)) {
          const element = this.coursesForm.value[key];
          this.record[key] = element;
        }
      }
    } else {
      this.record = this.coursesForm.value;
    }
    let obs: Observable<any> = null;
    if (this.record.id == undefined) {
      obs = this._baseService.insertRecord(environment.segmentUrls.admin.courses, this.record);

    } else {
      obs = this._baseService.updateRecord(environment.segmentUrls.admin.courses, this.record);
    }

    obs.subscribe(console.log);
  }

}
