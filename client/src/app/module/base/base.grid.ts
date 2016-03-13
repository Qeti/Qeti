import {Config} from '../../config';
import {GridServiceInterface} from './grid.service.interface';

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
  
  public editRow() {
      alert('edit');
  }
  
  public deleteRow() {
      alert('delete');
  }
}
