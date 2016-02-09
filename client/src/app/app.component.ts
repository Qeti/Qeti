import {Injectable} from 'angular2/core';
import {Component, View} from 'angular2/core';
import * as core from 'angular2/core';
import {UserResource} from './UserResource';
import {CompanyResource} from './CompanyResource';
import {Config} from './config';

declare var ag: any;
ag.grid.initialiseAgGridWithAngular2({core: core});
  
@Component({
  selector: 'my-app',
  bindings: [UserResource, CompanyResource]
})

@View({
  directives: [(<any>window).ag.grid.AgGridNg2],
  template: `
      <form (ngSubmit)="onSubmit()" #heroForm="ngForm">
        <div class="form-group">
          <label for="name">Login</label>
          <input type="text" class="form-control" required
            [(ngModel)]="login" >
        </div>
        <div class="form-group">
          <label for="alterEgo">Password</label>
          <input type="text"  class="form-control"
            [(ngModel)]="password">
        </div>
        <button type="submit" class="btn btn-default" [disabled]="!heroForm.form.valid">Login</button>
      </form>
    <div>\n\
      <button class="btn" (click)="agGrid.api.selectAll()">Select All</button>\n\
      <button class="btn btn-primary" (click)="getData()">Redraw grid</button>\n\
      <button class="btn" (click)="onLogout()">Logout</button>
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
export class AppComponent {

  private columnDefs: Object[];

  private enableFilter: boolean;

  private gridOptions: any = {};
  
  private classes: any = {
    "grid": true
  };
  
  private login: string = "mnv";
  private password: string = "12345";

  onSubmit() {
    let self = this;
    this.user.getApi().login({
      username: self.login,
      password: self.password,
    });
  }

  onLogout() {
    this.user.getApi().logout();
  }
  
  constructor(protected user: UserResource, 
    protected resource: CompanyResource, 
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
    let self = this;
    self.resource.getApi().count().then(function(response: any) {
      var lastRow = response.count;

      let datasource: any = {
        rowCount: null, // behave as infinite scroll
        pageSize: 100,
        overflowSize: 100,
        maxConcurrentRequests: 2,
        maxPagesInCache: 5,
        getRows: function (params: any) {
          self.resource
            .getApi().find({
              offset: params.startRow,
              limit: datasource.pageSize
            })
            .then(function(response: any) {
              params.successCallback(response, lastRow);
            });
        }
      };

      self.gridOptions.api.setDatasource(datasource);
    });
    
    this.classes[this.config.gridTheme] = true;
  }
}
