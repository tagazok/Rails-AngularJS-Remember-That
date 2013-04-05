// NotesIndexCtrl = function($scope, Note) {
//   $scope.notes = Note.query();

//   return $scope.destroy = function() {
//     var original;
//     if (confirm("Are you sure?")) {
//       original = this.note;
//       return this.note.destroy(function() {
//         return $scope.notes = _.without($scope.notes, original);
//       });
//     }
//   };
// };

// NotesIndexCtrl.$inject = ['$scope', 'Note'];

// NotesCreateCtrl = function($scope, $location, Note) {
//   return $scope.save = function() {
//     return Note.save($scope.note, function(note) {
//       return $location.path("/notes/" + note.id + "/edit");
//     });
//   };
// };

// NotesCreateCtrl.$inject = ['$scope', '$location', 'Note'];

// NotesShowCtrl = function($scope, $location, $routeParams, Note) {
//   Note.get({
//     id: $routeParams.id
//   }, function(note) {
//     this.original = note;
//     return $scope.note = new Note(this.original);
//   });
//   return $scope.destroy = function() {
//     if (confirm("Are you sure?")) {
//       return $scope.note.destroy(function() {
//         return $location.path("/notes");
//       });
//     }
//   };
// };

// NotesShowCtrl.$inject = ['$scope', '$location', '$routeParams', 'Note'];

// NotesEditCtrl = function($scope, $location, $routeParams, Note) {
//   Note.get({
//     id: $routeParams.id
//   }, function(note) {
//     this.original = note;
//     return $scope.note = new Note(this.original);
//   });
//   $scope.isClean = function() {
//     return angular.equals(this.original, $scope.note);
//   };
//   $scope.destroy = function() {
//     if (confirm("Are you sure?")) {
//       return $scope.note.destroy(function() {
//         return $location.path("/notes");
//       });
//     }
//   };
//   return $scope.save = function() {
//     return Note.update($scope.note, function(note) {
//       return $location.path("/notes");
//     });
//   };
// };

// NotesEditCtrl.$inject = ['$scope', '$location', '$routeParams', 'Note'];

'use strict';

thisApp.controller('MainCtrl', function($scope, $dialog, $http, Note, Google) {
	// $scope.notes = [];
	$scope.notes = Note.query();
	$scope.view = "list";
	$scope.showArchived = true;
	$scope.toto = ""
	$scope.note = {
		"title" : "",
		"content" : "",
		"color" : "white",
		"data" : {},
		"status" : "new"
	};

	$scope.actions = {
		"SAVING": false,
		"DELETING": false,
		"ARCHIVING": false,
		"UNARCHIVING": false,
		"GEOLOCALIZING": false,
		"GEOLOCALIZINGINFOS": false,
	};

	$scope.actions.saving = false;
	$scope.addsourcecode = function() {
		// $scope.newbody = $scope.newbody.concat("<ui-source><pre> <div>coucou</div></pre></ui-source>");

		// $scope.newbody = $scope.newbody.concat('<textarea ui-codemirror="{theme:\'monokai\'}"></textarea>');
	}

	function showLocation(position) {
		var latitude = position.coords.latitude;
		var longitude = position.coords.longitude;
		$scope.note.data.geolocation = {}
		$scope.note.data.geolocation.latitude = latitude;
		$scope.note.data.geolocation.longitude = longitude;
		$scope.actions.GEOLOCALIZING = false;
		$scope.actions.GEOLOCALIZINGINFOS = true;
		var city = Google.get({latlng : latitude + ',' + longitude}, function(result) {
			if (result.status == "OK") {
				$scope.note.data.geolocation.city = result.results[0].address_components[2].long_name;
				$scope.note.data.geolocation.country = result.results[0].address_components[5].long_name;
			}
			$scope.actions.GEOLOCALIZINGINFOS = false;
		});
	}

	function updateCurrentPosition(position) {
		// TODO
	}

	function errorHandler(err) {
		$scope.actions.GEOLOCALIZING = false;
		if(err.code == 1) {
			alert("Error: Access is denied!");
		}else if( err.code == 2) {
			alert("Error: Position is unavailable!");
		}
	}

	$scope.addgeolocation = function() {
		if (navigator.geolocation) {
			var options = {timeout:60000};
			$scope.actions.GEOLOCALIZING = true;
			navigator.geolocation.getCurrentPosition(showLocation,
				errorHandler,
				options);
		} else {
			alert("Sorry, browser does not support geolocation!");
		}
	}

	// $scope.updategeolocation = function() {
	// 	if (navigator.geolocation) {
	// 		var options = {timeout:60000};
	// 		navigator.geolocation.updateCurrentPosition(showLocation,
	// 			errorHandler,
	// 			options);
	// 	} else {
	// 		alert("Sorry, browser does not support geolocation!");
	// 	}
	// }

	$scope.add = function() {
		// $scope.note.date = Date.now();

		$scope.actions.SAVING = true;
		var note = new Note($scope.note);

		note.$save(function(note) {
			$scope.notes.push(note);
		$scope.actions.SAVING = false;
		});

		// $scope.notes.push(angular.copy($scope.note));
		$scope.note.title = "";
		$scope.note.content = "";
		$scope.note.color = "white";
		$scope.note.data = {};
		// $scope.note.data = {
		//  "geolocation" : {
		//    "latitude" : 0,
		//    "longitude" : 0
		//  }
		// };
	}

	$scope.changecolor = function(note, color) {
		note.color = color;
		$scope.actions.SAVING = true;
		note.$update(function(note) {
			$scope.actions.SAVING = false;
		});

	}
	$scope.saveCallback = function(note) {
		$scope.actions.SAVING = true;
		note.$update(function(note) {
			console.log("updated !");
			$scope.actions.SAVING = false;
		});
	}

	$scope.delete  = function(note) {
		if (confirm("Are you sure?")) {
			$scope.actions.DELETING = true;
			note.$destroy(function() {
				$scope.notes.splice($scope.notes.indexOf(note), 1);
				$scope.actions.DELETING = false;
			});
		}
	}

	$scope.changestatus = function(note, status) {
		note.status = status;
		if (status == "archived")
			$scope.actions.ARCHIVING = true;
		else
			$scope.actions.UNARCHIVING = true;
		note.$update(function(note) {
			$scope.actions.ARCHIVING = false;
			$scope.actions.UNARCHIVING = false;
		});
	}

	var t = '<div class="modal-header">'+
	'<h3>Add image</h3>'+
	'</div>'+
	'<div class="modal-body">'+
	'<p>Image url : <input ng-model="imageurl" class="imageurl"/></p>'+
	'</div>'+
	'<div class="modal-footer">'+
	'<button ng-click="add(imageurl)" class="btn btn-primary" >Add</button>'+
	'<button ng-click="close()" class="btn btn-primary" >Cancel</button>'+
	'</div>';

	$scope.opts = {
		backdrop: true,
		keyboard: true,
		backdropClick: true,
				template:  t, // OR: templateUrl: 'path/to/view.html',
				controller: 'AddImageCtrl'
			};

			$scope.openDialog = function(){
				var d = $dialog.dialog($scope.opts);
				d.open().then(function(result){
					if(result)
					{
						$scope.note.content = $scope.note.content.concat("<img src='" + result +"' />");
						// saveCallback($scope.note);
					}
				});
			};
		});

function AddImageCtrl($scope, dialog){
	$scope.close = function(){
		dialog.close();
	};

	$scope.add = function(result){
		dialog.close(result);
	};
}

