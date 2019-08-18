define(function(require) {
	'use strict';
	var _ = require('underscore');
	var appData = require('appData');
	
	var defaultState = {}

	var configData = (function(){
		return {
			message: appData.get('message') || 'WEBAPP CREATED BY SVHIQ'
		}
	})()


	// Extend defaultState
	_.extend(defaultState, configData)

	return {
		default: defaultState,
		make: (override) => {
			return _.extend({}, defaultState, override)
		}
	}
});