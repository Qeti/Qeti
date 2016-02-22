import {Injectable} from 'angular2/core';
import {Component, View} from 'angular2/core';
import * as core from 'angular2/core';
import {RouterLink} from 'angular2/router';
import {UserService} from '../user/service';
import {CompanyService} from './service';
//import {CompanyApi as CompanyService} from '../../lb-services';
import {Config} from '../../config';

declare var ag: any;
ag.grid.initialiseAgGridWithAngular2({core: core});
  
@Component({
  selector: 'company',
  bindings: [UserService, CompanyService]
})

@View({
  directives: [(<any>window).ag.grid.AgGridNg2, RouterLink],
  template: `
    <div>\n\
      <button class="btn" (click)="agGrid.api.selectAll()">Select All</button>\n\
      <button class="btn btn-primary" (click)="getData()">Redraw grid</button>\n\
      <a [routerLink]="['Home']">Home</a>
    </div>\n\
    <ag-grid-ng2
      #agGrid
      (ready)="agGrid.api.sizeColumnsToFit()"
      enableColResize
      enableSorting
      sizeColumnsToFit
      virtualPaging
      [ngClass]="classes"
      [gridOptions]="gridOptions"
      [enableFilter]="enableFilter"
      [columnDefs]="columnDefs"
    >
    </ag-grid-ng2>\n\
  `
})

@Injectable()
export class Company {

  private columnDefs: Object[];

  private enableFilter: boolean;

  private gridOptions: any = {};

  private classes: any = {
    "grid": true
  };

  constructor(protected user: UserService, 
    protected service: CompanyService, 
    private config: Config) {

    this.enableFilter = true;
    
    this.columnDefs = [
      {
        headerName: "Id", 
        field: "id", 
        filter: 'number', 
        width: 50
      },
      {
        headerName: "Name", 
        field: "Name", 
        width: 200
      },
      {
        headerName: "Description", 
        field: "Description", 
        cellRenderer: descriptionRenderer,
        width: 400
      }
    ];
  
    function descriptionRenderer(params: any) {
      return params.value ? '<img src="img/' + params.value + '" class="image-cell">' : '';
    }
    
    this.getData();
  }
  
  public getData() {
    this.service.getApi().count().subscribe((response: any) => {
      let lastRow = response.count;

      let datasource: any = {
        rowCount: null, // behave as infinite scroll
        pageSize: 100,
        overflowSize: 100,
        maxConcurrentRequests: 2,
        maxPagesInCache: 5,
        getRows: (params: any) => {
          this.service
            .getApi().find({
              offset: params.startRow,
              limit: datasource.pageSize
            })
            .subscribe(function(response: any) {
              params.successCallback(response, lastRow);
            });
        }
      };

      this.gridOptions.api.setDatasource(datasource);
    });
    
    this.classes[this.config.gridTheme] = true;
  }
}
