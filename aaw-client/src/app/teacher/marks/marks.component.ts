import { environment } from './../../../environments/environment';
import { Mark } from './../../model/mark';
import { BaseService } from './../../services/base-service';
import { AfterViewInit, Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { TeacherMarkDataSource } from '../../datasources/teacher-marks-datasource';
import { debounceTime, map, distinctUntilChanged } from 'rxjs/operators';
import { fromEvent } from 'rxjs';

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

  dataSource: TeacherMarkDataSource;
  selectedItem: Mark;
  displayedColumns = ['course', 'student', 'mark', 'complain', 'isComplainHandled'];

  constructor(private _baseService: BaseService) {
  }

  ngOnInit() {
    this.dataSource = new TeacherMarkDataSource(this._baseService);
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

  remove(item) {
    this._baseService.delete(environment.segmentUrls.teacher.marks, item.id)
      .subscribe(res => {
        console.log(res);
        this.dataSource.update.next(true);
      });
  }

  autoGen() {
    this._baseService.insertRecord(`${environment.segmentUrls.teacher.marks}/auto`, {})
      .subscribe(res => {
        console.log(res);
        this.dataSource.update.next(true);
      });
  }

}
