import { Deliberation } from './../../model/deliberation';
import { Component, OnInit } from '@angular/core';
import { BaseService } from 'src/app/services/base-service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-deliberation',
  templateUrl: './deliberation.component.html',
  styleUrls: ['./deliberation.component.scss']
})
export class DeliberationComponent implements OnInit {

  constructor(private _baseService: BaseService) { }
  deliberation: Deliberation;

  ngOnInit() {
    this._baseService.getRecords(environment.segmentUrls.student.deliberation, 0, null, null, null)
      .subscribe(res => this.deliberation = res.data.records[0] ? res.data.records[0] : null );
  }

  round(v:number){
    return v.toFixed(2);
  }

  complain(dlr) {
    this._baseService.updateRecord(environment.segmentUrls.student.deliberationComplain, dlr)
      .subscribe(console.log);
  }

}
