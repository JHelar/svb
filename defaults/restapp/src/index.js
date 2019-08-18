(function() {
	'use strict';
 
	var router  = require('router');
	var state = require('/module/state');
 
	router.get('/', function(req, res) {
	   res.json('/', state.default);
	});
	
 }());