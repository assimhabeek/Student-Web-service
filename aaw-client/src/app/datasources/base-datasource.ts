import { BaseService } from './../services/base-service';
import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { map, flatMap } from 'rxjs/operators';
import { Observable, of, merge, Subject } from 'rxjs';


export class BaseDataSource extends DataSource<any> {
  total: number;
  pageSize: number;
  paginator: MatPaginator;
  sort: MatSort;
  filter: any;
  update: Subject<any> = new Subject<any>();

  constructor(
    private _elemService: BaseService,
    private _url: string) {
    super();
    this.filter = {};
  }


  connect(): Observable<any> {
    const dataChangers = [
      of(1),
      this.update,
      this.paginator.page,
      this.sort.sortChange,
      this.filter.change
    ];

    return merge(...dataChangers).pipe(
      flatMap(() => {
        return this._elemService.getRecords(this._url, this.paginator.pageIndex, this.sort.active, this.sort.direction, this.filter.val)
          .pipe(
            map((x: any) => {
              this.total = x.data.total;
              this.pageSize = x.data.pageSize;
              return x.data.records;
            })
          );
      }));
  }



  disconnect() {
  }

}

