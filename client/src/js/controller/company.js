app.controller('CompanyController', [
  '$scope', '$timeout', '$q', '$controller', 'Company',
  function ($scope, $timeout, $q, $controller, entity) {
    angular.extend(this, $controller('GridController', {
      $scope: $scope, 
      $timeout: $timeout, 
      $q: $q, 
      entity: entity,
      columnDefs: [
        {
          headerName: "Id",
          name: "id",
          width: 50
        },
        {name: 'Name'},
        {
          field: 'Description',
          cellTemplate: '<img ng-show="COL_FIELD != null" ng-src="{{COL_FIELD != null ? \'img/\' + COL_FIELD : \'\'}}" style="height: 100%"/>'
        },
        {name: 'AddedAt'}
      ]
    }));
  }
]);
