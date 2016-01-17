app.controller('CompanyController', [
  '$scope', '$timeout', '$q', '$controller', 'Company',
  function ($scope, $timeout, $q, $controller, entity) {
    angular.extend(this, $controller('GridController', {
      $scope: $scope, 
      $timeout: $timeout, 
      $q: $q, 
      entity: entity,
      columnDefs: [
        {headerName: "Id", field: "id", width: 50},
        {name: 'Name'},
        {name: 'AddedAt'}
      ]
    }));
  }
]);
