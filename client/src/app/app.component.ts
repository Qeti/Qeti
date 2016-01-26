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
      [ngClass]="classes"
      [enableFilter]="enableFilter"
      [columnDefs]="columnDefs"
      [rowData]="rowData">
    </ag-grid-ng2>\n\
  `
})

export class AppComponent {

  private columnDefs: Object[];

  private rowData: Object[];
  
  private enableFilter: boolean;
  
  private classes = {
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
    resource.find({where: {id: {lt: 100}}}).then(function(response) {
      self.rowData = response;
    });
    
    this.classes[this.config.gridTheme] = true;
  }
  
  function descriptionRenderer(params) {
    return params.value ? '<img src="img/' + params.value + '" class="image-cell">' : '';
  }
}
