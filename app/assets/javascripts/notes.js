angular.module("notes", ["ngResource"]).
factory("Note", ['$resource', function($resource) {
	var Note;
	Note = $resource("/notes/:id",
		{ id: "@id" },
		{
			query: {method: 'GET', isArray:true, headers: {'X-Requested-With': 'XMLHttpRequest'}},
			update: { method: "PUT", headers: {'X-Requested-With': 'XMLHttpRequest'}},
			destroy: { method: "DELETE", headers: {'X-Requested-With': 'XMLHttpRequest'}},
			save: { method: "POST", headers: {'X-Requested-With': 'XMLHttpRequest'}}
		});

	Note.prototype.destroy = function(cb) {
		return Note.remove({
			id: this.id
		}, cb);
	};

	return Note;
}
]);
