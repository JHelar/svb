define(function(require) {
	'use strict';

	var _ = require('underscore');
	var Component = require('Component');
	var template = require('/template/main');

	return Component.extend({
		template: template,
		// Initialize the VUE app!
		onAttached: function() {
			var appId = this._templateFunctions().appContext.getWebAppNamespace(
				'app'
			);
			// A bugg in SiteVision crashes the browser tab if big Vue apps are rendered in edit mode. 
			// This prevents the vue client to be rendered in edit mode.
			if(!this.state.isEditMode) {
				window.APP_NAME(document.querySelector('#' + appId), this.state);
			}
		},
		filterState: function(state) {
			return _.extend({}, state);
		},
		templateFunctions: function() {
			var _this = this;

			return {
				renderPartial: function(partialName, data) {
					var template = require('/template/partials/' + partialName);
					if (template) {
						if (data) {
							return _this.renderTemplate(template, {
								data: data
							});
						} else {
							return _this.renderTemplate(template, _this.state);
						}
					} else {
						return 'No partial template found';
					}
				}
			};
		}
	});
});
