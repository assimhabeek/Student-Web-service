import { environment } from 'src/environments/environment';
import { BaseService } from './../../services/base-service';
import { AdminDeliberationDataSource } from './../../datasources/admin-deliberations-datasource';
import { Deliberation } from './../../model/deliberation';
import { MatTable } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material';
import { debounceTime, map, distinctUntilChanged } from 'rxjs/operators';
import { fromEvent } from 'rxjs';

@Component({
  selector: 'app-deliberations',
  templateUrl: './deliberations.component.html',
  styleUrls: ['./deliberations.component.scss']
})
export class DeliberationsComponent implements OnInit {
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatTable, { static: false }) table: MatTable<Deliberation>;
  @ViewChild('search', { static: false }) search: ElementRef;

  dataSource: AdminDeliberationDataSource;
  selectedItem: Deliberation;
  displayedColumns = ['student', 'unit1', 'unit2', 'unit3', 'avg', 'complain', 'isComplainHandled'];

  constructor(private _baseService: BaseService) {
  }

  ngOnInit() {
    this.dataSource = new AdminDeliberationDataSource(this._baseService);
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
    this._baseService.delete(environment.segmentUrls.admin.deliberation, item.id)
      .subscribe(res => {
        console.log(res);
        this.dataSource.update.next(true);
      });
  }

  autoGen() {
    this._baseService.insertRecord(`${environment.segmentUrls.admin.deliberation}/auto`, {})
      .subscribe(res => {
        this.dataSource.update.next(true);
      });
  }

}
