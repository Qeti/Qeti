app.controller('MainCtrl', ['$scope', 'Company', function ($scope, Company) {

  $scope.myData = [];
  function getData() {
    Company
      .find()
      .$promise
      .then(function(results) {
        $scope.myData = results;
      });
  }
  getData();

}]);
