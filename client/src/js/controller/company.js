app.controller('CompanyController', [
  '$scope', '$timeout', '$q', '$controller', 'Company',
  function ($scope, $timeout, $q, $controller, Entity) {
    angular.extend(this, $controller('GridController', {
      $scope: $scope, 
      $timeout: $timeout, 
      $q: $q, 
      Entity: Entity
    }));
  }
]);
