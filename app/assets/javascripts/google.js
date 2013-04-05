angular.module('google', ['ngResource']).
factory('Google', function($resource) {
	var Result = $resource('http://maps.googleapis.com/maps/api/geocode/json',
		{
			latlng : "@latlng",
			sensor : true

		}, {
			'get': { method: "GET", params: { id: 0 } },
		}
	);

	return Result;
});