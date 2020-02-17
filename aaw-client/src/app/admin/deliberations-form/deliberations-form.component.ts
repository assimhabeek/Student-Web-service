import { environment } from './../../../environments/environment.prod';
import { debounceTime, map, distinctUntilChanged, flatMap } from 'rxjs/operators';
import { BaseService } from './../../services/base-service';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/model/user';
import { Deliberation } from 'src/app/model/deliberation';
import { Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-deliberations-form',
  templateUrl: './deliberations-form.component.html',
  styleUrls: ['./deliberations-form.component.scss']
})
export class DeliberationsFormComponent implements OnInit {

  filteredStudents: Observable<User>;
  record: Deliberation;
  deliberationsForm = this.fb.group({
    student: [null, Validators.required],
    unit1: [null, Validators.required],
    unit2: [null, Validators.required],
    unit3: [null, Validators.required]
  });

  constructor(
    private activeRoute: ActivatedRoute,
    private fb: FormBuilder,
    private _baseService: BaseService) { }

  ngOnInit(): void {
    const studentValues = this.deliberationsForm.controls.student.valueChanges;
    this.activeRoute.params.subscribe(p => {
      if (p && p.id && p.id != 0) {
        this._baseService.getRecord(environment.segmentUrls.admin.deliberation, p.id)
          .subscribe(v => {
            this.record = v.data;
            this.deliberationsForm.patchValue(v.data);
          });
      }
    });

    this.filteredStudents = studentValues.pipe(
      debounceTime(400),
      distinctUntilChanged(),
      flatMap(x => {
        return this._baseService.getRecords(environment.segmentUrls.admin.students, 0, null, null, x)
          .pipe(map(y => y.data.records));
      }));


  }


  displayStudentFn(ele?: any): string | undefined {
    return ele ? ele.fullName : undefined;
  }

  onSubmit() {
    if (this.record) {
      for (const key in this.deliberationsForm.value) {
        if (this.deliberationsForm.value.hasOwnProperty(key)) {
          const element = this.deliberationsForm.value[key];
          this.record[key] = element;
        }
      }
    } else {
      this.record = this.deliberationsForm.value;
    }
    let obs: Observable<any> = null;
    if (this.record.id == undefined) {
      obs = this._baseService.insertRecord(environment.segmentUrls.admin.deliberation, this.record);

    } else {
      obs = this._baseService.updateRecord(environment.segmentUrls.admin.deliberation, this.record);
    }

    obs.subscribe(console.log);
  }

}
