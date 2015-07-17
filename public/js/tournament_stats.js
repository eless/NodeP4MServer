/**
 * Created by Eless on 28.05.2015.
 */
angular.module('appStats', [])
    .controller('paginationStatsCtrl', ['$scope', '$routeParams', '$http', function ($scope, $routeParams, $http) {
        $scope.id = $routeParams.id;
        $scope.itemsByPage=20;
        $http.get('/tournament/info/'+ $scope.id).success(function(resp) {
            debugger;
            $scope.rowCollection = {};
            $scope.headersCollection = new Array();
            $scope.description = resp.tournament.description;
            if(data && data.length > 0){
                debugger;
                $scope.rowCollection = resp.data;
                for(var prop in resp.data[0]) {
                    if(resp.data[0].hasOwnProperty(prop)) {
                        $scope.headersCollection.push(prop)
                    }
                }
            }
        });
    } ]);