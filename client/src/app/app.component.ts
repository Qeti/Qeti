import {Component, View} from 'angular2/core';
import * as core from 'angular2/core';
import {CompanyResource} from './company';
import {Config} from './config';

declare var ag: any;
ag.grid.initialiseAgGridWithAngular2({core: core});
  
@Component({
  selector: 'my-app',
  bindings: [CompanyResource]
})

@View({
  directives: [(<any>window).ag.grid.AgGridNg2],
  template: `
    <div>\n\
      <button (click)="agGrid.api.selectAll()">Select All</button>\n\
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

export class AppComponent {

  private columnDefs: Object[];

  private enableFilter: boolean;

  private gridOptions: any = {};
  
  private classes: any = {
    "grid": true
  };

  constructor(resource: CompanyResource, private config: Config) {
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

    let self = this;
    resource.getApi().count().then(function(response: any) {
      var lastRow = response.count;

      let datasource: any = {
        rowCount: null, // behave as infinite scroll
        pageSize: 100,
        overflowSize: 100,
        maxConcurrentRequests: 2,
        maxPagesInCache: 5,
        getRows: function (params: any) {
          resource
            .getApi().find({
              offset: params.startRow,
              limit: datasource.pageSize
            })
            .then(function(response) {
              params.successCallback(response, lastRow);
            });
        }
      };

      self.gridOptions.api.setDatasource(datasource);
    });
    
    this.classes[this.config.gridTheme] = true;
  
    function descriptionRenderer(params: any) {
      return params.value ? '<img src="img/' + params.value + '" class="image-cell">' : '';
    }
  }
}
