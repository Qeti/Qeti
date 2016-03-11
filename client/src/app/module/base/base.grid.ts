//import {View} from 'angular2/core';
//import {CORE_DIRECTIVES, FORM_DIRECTIVES} from 'angular2/common';
//import {RouterLink} from 'angular2/router';
//import {AgGridNg2} from 'ag-grid-ng2/main';
import {CompanyApi as CompanyService} from '../../lb-services';
import {Config} from '../../config';
import {GridServiceInterface} from './grid.service.interface';

//@View({
//  directives: [AgGridNg2, RouterLink, CORE_DIRECTIVES, FORM_DIRECTIVES],
//  templateUrl: 'app/module/base/base.grid.html'
//})
export class BaseGrid {

  protected columnDefs: Object[] = [
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
      width: 300
    }
  ];

  protected enableFilter: boolean = true;

  protected gridOptions: any = {};

  protected classes: any = {
    "grid": true
  };

  constructor(protected service: GridServiceInterface, protected config: Config) {
    this.getData();
  }
  
  public getData() {
    this.service.count().subscribe((response: any) => {
      let lastRow = response.count;

      let datasource: any = {
        rowCount: null, // behave as infinite scroll
        pageSize: 100,
        overflowSize: 100,
        maxConcurrentRequests: 2,
        maxPagesInCache: 5,
        getRows: (params: any) => {
          this.service
            .find({
              offset: params.startRow,
              limit: datasource.pageSize
            })
            .subscribe((response: any) => {
              params.successCallback(response, lastRow);
            });
        }
      };

      this.gridOptions.api.setDatasource(datasource);
    });
    
    this.classes[this.config.gridTheme] = true;
  }
}
