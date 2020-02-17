import { Mark } from './../../model/mark';
import { BaseService } from './../../services/base-service';
import { AfterViewInit, Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { StudentMarkDataSource } from '../../datasources/student-marks-datasource';
import { debounceTime, map, distinctUntilChanged, filter } from 'rxjs/operators';
import { fromEvent } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-marks',
  templateUrl: './marks.component.html',
  styleUrls: ['./marks.component.scss']
})
export class MarksComponent implements AfterViewInit, OnInit {
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatTable, { static: false }) table: MatTable<Mark>;
  @ViewChild('search', { static: false }) search: ElementRef;

  dataSource: StudentMarkDataSource;

  displayedColumns = ['course', 'mark', 'complain'];

  constructor(private _baseService: BaseService) {
  }

  ngOnInit() {
    this.dataSource = new StudentMarkDataSource(this._baseService);
  }


  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.dataSource.filter.change = fromEvent(this.search.nativeElement, 'keyup').pipe(
      map((event: any) => {
        this.dataSource.filter.val = event.target.value;
        return event.target.value;
      })
      , debounceTime(400)
      , distinctUntilChanged()
    );
    this.table.dataSource = this.dataSource;
  }

  complain(mark) {
    this._baseService.updateRecord(environment.segmentUrls.student.markComplain, mark)
      .subscribe(console.log);
  }
}
