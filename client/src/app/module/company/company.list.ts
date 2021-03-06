import {Component, View} from 'angular2/core';
import {CORE_DIRECTIVES, FORM_DIRECTIVES} from 'angular2/common';
import {RouterLink} from 'angular2/router';
import {AgGridNg2} from 'ag-grid-ng2/main';
import {CompanyApi} from '../../lb-services';
import {BaseGrid} from '../base/base.grid';
import {Config} from '../../config';

@Component({
  selector: 'company-list',
  host: { 'class': 'section-list' },
  providers: [CompanyApi]
})
@View({
  directives: [AgGridNg2, RouterLink, CORE_DIRECTIVES, FORM_DIRECTIVES],
  templateUrl: 'app/module/base/base.grid.html'
})
export class CompanyList extends BaseGrid {

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
    },
    {
      headerName: "Image", 
      field: "Image", 
      cellRenderer: function (params: any) {
        return params.value ? '<img src="img/' + params.value + '" class="image-cell">' : '';
      },
      width: 80
    }
  ];

  constructor(protected service: CompanyApi, protected config: Config) {
    super(service, config);
  }
}
