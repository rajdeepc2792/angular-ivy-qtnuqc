import { Component } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MapReduceApiService } from './services/map-reduce-api.service';
import { debounceTime, filter, map, switchMap, tap } from 'rxjs/operators'
import { Observable, Subject } from 'rxjs';

export interface MapReduceData {
  result: string
}

export interface Results {
  response: string
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'MapReducerSearchFE';
  searchString = ''
  displayedCol = ['response'];
  dataSource: MatTableDataSource<Results>;
  result$: Observable<string[]>;
  subject = new Subject<string>();
  loading = false

  constructor(private mapService: MapReduceApiService) {
    const data: Results[] = [];
    this.dataSource = new MatTableDataSource(data);
  }

  ngOnInit() {
    this.result$ = this.subject.pipe(
      tap(() => {this.loading = true}),
      debounceTime(500),
      switchMap((searchValue: string) => this.mapService.getData(searchValue)),
      map(data => data.result.split('\n'))
    );
    
    this.result$.subscribe((result_data) =>{
      result_data = result_data.filter(s => s.length != 0 && s != "Error: could not handle the request");
      const data = result_data.map(s => ({response: s}))
      this.dataSource.data = data;
      this.loading = false
    }, error => {
      this.dataSource.data = []
      console.error(error)
      this.loading = false
    })

    this.loadInitialData(this.searchString)
  }

  loadInitialData(searchValue: string) {
    this.subject.next(searchValue);
  }

  search(search: string) {
    if(search != null) {
      this.searchString = search.trim();
      this.searchString = search.toLowerCase();
    }
    else {
      this.searchString = ""
    }

    this.loadInitialData(this.searchString)
  }

  sortData(sort: Sort) {
    const data = this.dataSource.data.slice();
    if (!sort.active || sort.direction === '') {
      this.dataSource.data = data;
      return;
    }

    this.dataSource.data = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'name':
          return compare(a.response, b.response, isAsc);
        default:
          return 0;
      }
    });
  }

  isEmpty() {
    return this.dataSource.data.length === 0;
  }
}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
