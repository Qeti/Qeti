import {Component, View} from 'angular2/core';
import * as core from 'angular2/core';
import {RouterLink} from 'angular2/router';
import {CompanyApi as CompanyService} from '../../lb-services';
import {Config} from '../../config';

import {CORE_DIRECTIVES, FORM_DIRECTIVES} from 'angular2/common';

declare var ag: any;
ag.grid.initialiseAgGridWithAngular2({core: core});

@Component({
  selector: 'company',
  bindings: [CompanyService]
})
@View({
  directives: [(<any>window).ag.grid.AgGridNg2, RouterLink, CORE_DIRECTIVES, FORM_DIRECTIVES],
  templateUrl: 'app/module/company/grid.html'
})
export class Company {

  private columnDefs: Object[] = [
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
      cellRenderer: function (params: any) {
        return params.value ? '<img src="img/' + params.value + '" class="image-cell">' : '';
      },
      width: 300
    }
  ];

  private enableFilter: boolean = true;

  private gridOptions: any = {};

  private classes: any = {
    "grid": true
  };

  constructor(protected service: CompanyService, private config: Config) {
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
