import { User } from 'src/app/model/user';
import { debounceTime, map, distinctUntilChanged, flatMap } from 'rxjs/operators';
import { Mark } from './../../model/mark';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { BaseService } from 'src/app/services/base-service';
import { environment } from 'src/environments/environment';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-mark-form',
  templateUrl: './mark-form.component.html',
  styleUrls: ['./mark-form.component.scss']
})
export class MarkFormComponent implements OnInit {

  filteredCourses: Observable<Mark>;
  filteredStudents: Observable<User>;
  record: Mark;
  marksForm = this.fb.group({
    course: [null, Validators.required],
    student: [null, Validators.required],
    mark: [null, Validators.required]
  });


  constructor(
    private activeRoute: ActivatedRoute,
    private fb: FormBuilder,
    private _baseService: BaseService) { }



  ngOnInit(): void {
    const courseValues = this.marksForm.controls.course.valueChanges;
    const studentValues = this.marksForm.controls.student.valueChanges;
    this.activeRoute.params.subscribe(p => {
      if (p && p.id && p.id != 0) {
        this._baseService.getRecord(environment.segmentUrls.admin.marks, p.id)
          .subscribe(v => {
            this.record = v.data;
            this.marksForm.patchValue(v.data);
          });
      }
    });

    this.filteredCourses = courseValues.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      flatMap(x => {
        return this._baseService.getRecords(environment.segmentUrls.admin.courses, 0, null, null, x)
          .pipe(map(y => y.data.records));
      }));

    this.filteredStudents = studentValues.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      flatMap(x => {
        return this._baseService.getRecords(environment.segmentUrls.admin.students, 0, null, null, x)
          .pipe(map(y => y.data.records));
      }));


  }

  displayCourseFn(ele?: any): string | undefined {
    return ele ? ele.abb : undefined;
  }

  displayStudentFn(ele?: any): string | undefined {
    return ele ? ele.fullName : undefined;
  }

  onSubmit() {
    if (this.record) {
      for (const key in this.marksForm.value) {
        if (this.marksForm.value.hasOwnProperty(key)) {
          const element = this.marksForm.value[key];
          this.record[key] = element;
        }
      }
    } else {
      this.record = this.marksForm.value;
    }
    let obs: Observable<any> = null;
    if (this.record.id == undefined) {
      obs = this._baseService.insertRecord(environment.segmentUrls.admin.marks, this.record);

    } else {
      obs = this._baseService.updateRecord(environment.segmentUrls.admin.marks, this.record);
    }

    obs.subscribe(console.log);
  }
}
