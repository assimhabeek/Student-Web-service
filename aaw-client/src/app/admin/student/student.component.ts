import { environment } from './../../../environments/environment';
import { User } from './../../model/user';
import { BaseService } from './../../services/base-service';
import { AfterViewInit, Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { AdminStudentDataSource } from '../../datasources/admin-students-datasource';
import { debounceTime, map, distinctUntilChanged } from 'rxjs/operators';
import { fromEvent } from 'rxjs';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.scss']
})
export class StudentComponent implements OnInit {

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatTable, { static: false }) table: MatTable<User>;
  @ViewChild('search', { static: false }) search: ElementRef;

  dataSource: AdminStudentDataSource;
  selectedItem: User;
  displayedColumns = ['fullName', 'username'];

  constructor(private _baseService: BaseService) {
  }

  ngOnInit() {
    this.dataSource = new AdminStudentDataSource(this._baseService);
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
    this._baseService.delete(environment.segmentUrls.admin.users.student, item.id)
      .subscribe(res => {
        console.log(res);
        this.dataSource.update.next(true);
      });
  }

}
