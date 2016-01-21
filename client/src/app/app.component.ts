
import {Component, View} from 'angular2/core';
import {CompanyService} from './services/company'
import * as core from 'angular2/core';

declare var ag: any;
ag.grid.initialiseAgGridWithAngular2({ core: core });
  
@Component({
  selector: 'my-app',
  bindings: [CompanyService]
})

@View({
  directives: [(<any>window).ag.grid.AgGridNg2],
  template: `
    <ag-grid-ng2
      class="ag-fresh grid"
      [columnDefs]="columnDefs"
      [rowData]="rowData">
    </ag-grid-ng2>\n\
  `
})

export class AppComponent {

  private columnDefs: Object[];

  private rowData: Object[];

  constructor(service: CompanyService) {
    this.columnDefs = [
      {headerName: "Id", field: "id"},
      {headerName: "Name", field: "Name"},
      {headerName: "Description", field: "Description"}
    ];

    service.getList().subscribe(
      (res: Response) => {
        this.rowData = res;
      }
    );
  }
}
