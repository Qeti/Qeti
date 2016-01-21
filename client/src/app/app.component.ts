import {Component, View} from 'angular2/core';

@Component({
  selector: 'my-app'
})

@View({
  directives: [(<any>window).ag.grid.AgGridNg2],
  template: `
    <h1>ok</h1>\n\
    <ag-grid-ng2
    class="ag-fresh grid"
    [columnDefs]="columnDefs" [rowData]="rowData"></ag-grid-ng2>\n\
    <h2>{{test}}</h2>\n\
  `
})

export class AppComponent {

  private columnDefs: Object[];

  private rowData: Object[];

  private test: string;
  
  constructor() {
    this.columnDefs = [
      {headerName: "Make", field: "make"},
      {headerName: "Model", field: "model"},
      {headerName: "Price", field: "price"}
    ];

        // put data directly onto the controller
    this.rowData = [
      {make: "Toyota", model: "Celica", price: 35000},
      {make: "Ford", model: "Mondeo", price: 32000},
      {make: "Porsche", model: "Boxter", price: 72000}
    ];
    
    this.test = 'test!';
  }
}
