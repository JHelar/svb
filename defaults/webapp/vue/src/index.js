(function() {
	'use strict';
 
	var router  = require('router');
	var state = require('/module/server/state');
 
	router.get('/', function(req, res) {
	   res.render('/', state.default);
	});
	
 }());