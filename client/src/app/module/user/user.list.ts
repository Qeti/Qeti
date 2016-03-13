import {Component, View} from 'angular2/core';
import {CORE_DIRECTIVES, FORM_DIRECTIVES} from 'angular2/common';
import {RouterLink} from 'angular2/router';
import {AgGridNg2} from 'ag-grid-ng2/main';
import {UserApi} from '../../lb-services';
import {BaseGrid} from '../base/base.grid';
import {Config} from '../../config';

@Component({
  selector: 'user',
  host: { 'class': 'section-list' },
  providers: [UserApi]
})
@View({
  directives: [AgGridNg2, RouterLink, CORE_DIRECTIVES, FORM_DIRECTIVES],
  templateUrl: 'app/module/base/base.grid.html'
})
export class UserList extends BaseGrid {

  protected columnDefs: Object[] = [
    {
      headerName: "Id", 
      field: "id", 
      filter: 'number', 
      width: 50
    },
    {
      headerName: "Name", 
      field: "realm", 
      width: 200
    },
    {
      headerName: "Email", 
      field: "email", 
      width: 200
    }
  ];

  constructor(protected service: UserApi, protected config: Config) {
    super(service, config);
  }
}
