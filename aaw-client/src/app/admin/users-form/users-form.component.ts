import { User } from 'src/app/model/user';
import { debounceTime, map, distinctUntilChanged, flatMap } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { BaseService } from 'src/app/services/base-service';
import { environment } from 'src/environments/environment';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-users-form',
  templateUrl: './users-form.component.html',
  styleUrls: ['./users-form.component.scss']
})
export class UsersFormComponent implements OnInit {

  record: User;
  usersForm = this.fb.group({
    name: this.fb.group({
      last: [null, Validators.required],
      first: [null, Validators.required],
    }),
    username: [null, Validators.required],
    password: [null, Validators.required],
    type: [null, Validators.required],
  });


  constructor(
    private activeRoute: ActivatedRoute,
    private fb: FormBuilder,
    private _baseService: BaseService) { }



  ngOnInit(): void {
    this.activeRoute.params.subscribe(p => {
      if (p && p.id && p.id != 0) {
        this.activeRoute.queryParams.subscribe(d => {
          this._baseService.getRecord(environment.segmentUrls.admin.users[d.type], p.id)
            .subscribe(v => {
              this.record = v.data;
              this.usersForm.patchValue(v.data);
            });
        });
      }
    });

  }

  onSubmit() {
    if (this.record) {
      for (const key in this.usersForm.value) {
        if (this.usersForm.value.hasOwnProperty(key)) {
          const element = this.usersForm.value[key];
          this.record[key] = element;
        }
      }
    } else {
      this.record = this.usersForm.value;
    }
    let obs: Observable<any> = null;
    if (this.record.id == undefined) {
      obs = this._baseService.insertRecord(environment.segmentUrls.admin.users[this.record.type], this.record);

    } else {
      obs = this._baseService.updateRecord(environment.segmentUrls.admin.users[this.record.type], this.record);
    }

    obs.subscribe(console.log);
  }

}
