app.controller('CompanyController', [
  '$scope', '$timeout', '$q', 'Company', 
  function ($scope, $timeout, $q, Entity) {
    GridController($scope, $timeout, $q, Entity);
  }
]);
