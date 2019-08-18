define(function(require) {
	'use strict';
	var _ = require('underscore');
	var appData = require('appData');
	const VersionUtil = require('VersionUtil');
	const isEditMode = VersionUtil.getCurrentVersion() === VersionUtil.OFFLINE_VERSION;
	
	var defaultState = {}

	var configData = (function(){
		return {
			message: appData.get('message') || 'WEBAPP CREATED BY SVHIQ',
			isEditMode: isEditMode
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