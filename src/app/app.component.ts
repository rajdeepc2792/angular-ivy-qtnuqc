import { Component } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MapReduceApiService } from './services/map-reduce-api.service';

export interface MapReduceData {
  id: string
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'MapReducerSearchFE';
  searchString = ''
  displayedCol = ['id'];
  dataSource: MatTableDataSource<MapReduceData>;

  constructor(private mapService: MapReduceApiService) {
    const data: MapReduceData[] = [];
    for(let i = 1; i<=100; i++) {
      data.push({id: i.toString()})
    }

    this.dataSource = new MatTableDataSource(data);
  }

  ngOnInit() {
    this.loadInitialData(this.searchString)
  }

  loadInitialData(searchValue: string) {
    this.mapService.getData('','').subscribe(response => {
      const data: MapReduceData[] = [];
      for(let i = 1; i<=100; i++) {
        data.push({id: i.toString()})
      }
      this.dataSource.data = data;
    }, error => console.error(error));
  }

  search(search: string) {
    this.searchString = search.trim();
    this.searchString = search.toLowerCase();

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
          return compare(a.id, b.id, isAsc);
        default:
          return 0;
      }
    });
  }
}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
