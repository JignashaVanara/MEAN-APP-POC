function AppCtrl($scope, $http){
    console.log("Hello World from Controller")

    var refresh = function(){
        $http.get('/contactlist').success(function(response){
            $scope.contactlist = response;
            $scope.contact = ""
        });
    };
    
    refresh();


    $scope.addContacts = function(){
        $http.post('/contactlist', $scope.contact).success(function(response){
            console.log(response)
            refresh();
        })
    }

    $scope.getItembyID = function(id){
        $http.get('/contactlist/'+id).success(function(response){
            $scope.contact1 = response
            console.log($scope.contact1);
        });
    }

    $scope.editItem = function(id){
        $http.put('/contactlist/'+id, $scope.contact1).success(function(response){
            console.log("inside edit....")
            console.log($scope.contact1)
            refresh();
        }).error(function(err){
            console.log(err)
        });
    }

    $scope.removeItem = function(id){
        $http.delete('/contactlist/'+id).success(function(response){
            console.log(response)
            refresh();
        }).error(function(err){
            console.log(err)
        });
    }

}